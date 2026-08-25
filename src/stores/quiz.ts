import {atom} from "jotai";
import {
    CHECKPOINT_INTERVAL,
    PRACTICE_BATCH,
    PRACTICE_PREFETCH_THRESHOLD,
} from "@/constants/certification";
import type {AssessmentQuestion, Difficulty, Domain} from "@/models/assessment";
import type {Badge} from "@/models/progression";
import {api} from "@/services/api";
import {learnPracticeHourAtom} from "@/stores/notifications";
import {recordOutcomeAtom} from "@/stores/progression";
import {responseByQuestionAtom, revealQuestionAtom} from "@/stores/question";
import {
    recordDailyAnswerAtom,
    reviewQueueAtom,
    scheduleQuestionReviewAtom,
} from "@/stores/retention";
import {ensureUserAtom} from "@/stores/user";
import {getNextDifficulty} from "@/utils/adaptive";
import {gradeQuestion} from "@/utils/grading";
import {getDueCards} from "@/utils/scheduler";

type QuizStatus = "idle" | "loading" | "ready" | "error";

export type AnswerFeedback = {
    correct: boolean;
    accuracy: number;
    xpAwarded: number;
    leveledUp: boolean;
    unlockedBadge: Badge | null;
    goalMet: boolean;
};

export type SessionCheckpoint = {
    answered: number;
    correct: number;
    accuracy: number;
    xpEarned: number;
};

export const quizAtom = atom<string[]>([]);
export const currentQuestionIndexAtom = atom(0);
export const quizStatusAtom = atom<QuizStatus>("idle");
export const quizErrorAtom = atom<string | null>(null);
export const quizDomainAtom = atom<Domain | undefined>(undefined);
export const adaptiveDifficultyAtom = atom<Difficulty>(0);
export const adaptiveHistoryAtom = atom<boolean[]>([]);
export const lastFeedbackAtom = atom<AnswerFeedback | null>(null);

export const sessionAnsweredAtom = atom(0);
export const sessionCorrectAtom = atom(0);
export const sessionXpAtom = atom(0);
export const checkpointAtom = atom<SessionCheckpoint | null>(null);
const lastCheckpointAtAtom = atom(0);

export const sessionAccuracyAtom = atom((get) => {
    const answered = get(sessionAnsweredAtom);
    return answered ? get(sessionCorrectAtom) / answered : 0;
});

const loadBatchAtom = atom(
    null,
    async (get, _set, options: {length?: number} = {}) => {
        const domain = get(quizDomainAtom);
        const existing = get(quizAtom);

        const reviewIds = getDueCards(await get(reviewQueueAtom))
            .filter((card) => !domain || card.domain === domain)
            .map((card) => card.questionId)
            .filter((id) => !existing.includes(id));

        return api.getSession({
            length: options.length ?? PRACTICE_BATCH,
            domain,
            difficulty: get(adaptiveDifficultyAtom),
            reviewIds,
            excludeIds: existing,
        });
    }
);

export const initializeQuizAtom = atom(
    null,
    async (_get, set, options: {length?: number; domain?: Domain} = {}) => {
        set(quizStatusAtom, "loading");
        set(quizErrorAtom, null);
        set(lastFeedbackAtom, null);
        set(checkpointAtom, null);
        set(lastCheckpointAtAtom, 0);
        set(sessionAnsweredAtom, 0);
        set(sessionCorrectAtom, 0);
        set(sessionXpAtom, 0);

        if (options.domain !== undefined) {
            set(quizDomainAtom, options.domain);
        }

        try {
            await set(ensureUserAtom);
            await set(learnPracticeHourAtom);

            set(quizAtom, []);
            const batch = await set(loadBatchAtom, {length: options.length});

            set(quizAtom, batch);
            set(currentQuestionIndexAtom, 0);
            set(quizStatusAtom, "ready");
        } catch (error) {
            set(quizStatusAtom, "error");
            set(
                quizErrorAtom,
                error instanceof Error
                    ? error.message
                    : "Could not load the session"
            );
        }
    }
);

export const extendQuizAtom = atom(null, async (get, set) => {
    const batch = await set(loadBatchAtom);

    if (!batch.length) {
        return false;
    }

    set(quizAtom, [...get(quizAtom), ...batch]);
    return true;
});

export const goToNextQuestionAtom = atom(null, async (get, set) => {
    const answered = get(sessionAnsweredAtom);

    if (
        answered > 0 &&
        answered % CHECKPOINT_INTERVAL === 0 &&
        get(lastCheckpointAtAtom) !== answered
    ) {
        const correct = get(sessionCorrectAtom);

        set(lastCheckpointAtAtom, answered);
        set(checkpointAtom, {
            answered,
            correct,
            accuracy: correct / answered,
            xpEarned: get(sessionXpAtom),
        });

        return;
    }

    set(lastFeedbackAtom, null);

    const nextIndex = get(currentQuestionIndexAtom) + 1;

    if (get(quizAtom).length - nextIndex <= PRACTICE_PREFETCH_THRESHOLD) {
        await set(extendQuizAtom);
    }

    if (nextIndex < get(quizAtom).length) {
        set(currentQuestionIndexAtom, nextIndex);
    }
});

export const dismissCheckpointAtom = atom(null, (_get, set) => {
    set(checkpointAtom, null);
});

export const submitAnswerAtom = atom(
    null,
    async (get, set, question: AssessmentQuestion) => {
        const response = get(responseByQuestionAtom)[question.id];
        const grade = gradeQuestion(question, response);

        const history = [...get(adaptiveHistoryAtom), grade.correct];
        set(adaptiveHistoryAtom, history);
        set(
            adaptiveDifficultyAtom,
            getNextDifficulty(get(adaptiveDifficultyAtom), history)
        );

        const daily = await set(recordDailyAnswerAtom, grade.correct);

        const outcome = await set(recordOutcomeAtom, {
            domain: question.domain,
            difficulty: question.difficulty,
            correct: grade.correct,
            accuracy: grade.accuracy,
            streak: daily.streak,
        });

        await set(scheduleQuestionReviewAtom, {
            questionId: question.id,
            domain: question.domain,
            correct: grade.correct,
            accuracy: grade.accuracy,
        });

        set(revealQuestionAtom, question.id);

        const answered = get(sessionAnsweredAtom) + 1;
        const correct = get(sessionCorrectAtom) + (grade.correct ? 1 : 0);
        const xpEarned = get(sessionXpAtom) + outcome.xpAwarded;

        set(sessionAnsweredAtom, answered);
        set(sessionCorrectAtom, correct);
        set(sessionXpAtom, xpEarned);

        const feedback: AnswerFeedback = {
            correct: grade.correct,
            accuracy: grade.accuracy,
            goalMet: daily.goalMet,
            ...outcome,
        };

        set(lastFeedbackAtom, feedback);
        return feedback;
    }
);
