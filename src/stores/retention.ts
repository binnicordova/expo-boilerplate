import {atom} from "jotai";
import {atomWithStorage, unwrap} from "jotai/utils";
import {STORAGE_ID} from "@/constants/storage";
import type {Domain} from "@/models/assessment";
import type {ReviewCard, StreakState} from "@/models/progression";
import {createReviewCard, getDueCards, scheduleReview} from "@/utils/scheduler";
import {storage} from "@/utils/storage";
import {
    getActiveStreak,
    getDailyGoal,
    INITIAL_STREAK,
    isStreakAtRisk,
    recordAnswer,
    registerActivity,
} from "@/utils/streak";

export const streakAtom = atomWithStorage<StreakState>(
    STORAGE_ID.streak,
    INITIAL_STREAK,
    storage
);

export const reviewQueueAtom = atomWithStorage<Record<string, ReviewCard>>(
    STORAGE_ID.reviewQueue,
    {},
    storage
);

export const streakValueAtom = unwrap(
    streakAtom,
    (previous) => previous ?? INITIAL_STREAK
);

export const reviewQueueValueAtom = unwrap(
    reviewQueueAtom,
    (previous) => previous ?? {}
);

export const activeStreakAtom = atom((get) =>
    getActiveStreak(get(streakValueAtom))
);

export const streakAtRiskAtom = atom((get) =>
    isStreakAtRisk(get(streakValueAtom))
);

export const dueReviewsAtom = atom((get) =>
    getDueCards(get(reviewQueueValueAtom))
);

export const dailyGoalAtom = atom((get) => getDailyGoal(get(streakValueAtom)));

export const recordDailyAnswerAtom = atom(
    null,
    async (get, set, correct: boolean) => {
        const current = await get(streakAtom);
        const next = recordAnswer(current, correct);

        set(streakAtom, next);

        return {
            streak: getActiveStreak(next),
            goalMet: next.lastGoalDay !== current.lastGoalDay,
            daily: getDailyGoal(next),
        };
    }
);

export const registerDailyActivityAtom = atom(null, async (get, set) => {
    const current = await get(streakAtom);
    const next = registerActivity(current);

    if (next !== current) {
        set(streakAtom, next);
    }

    return getActiveStreak(next);
});

export const scheduleQuestionReviewAtom = atom(
    null,
    async (
        get,
        set,
        payload: {
            questionId: string;
            domain: Domain;
            correct: boolean;
            accuracy: number;
        }
    ) => {
        const queue = await get(reviewQueueAtom);
        const card =
            queue[payload.questionId] ??
            createReviewCard(payload.questionId, payload.domain);

        set(reviewQueueAtom, {
            ...queue,
            [payload.questionId]: scheduleReview(card, payload),
        });
    }
);
