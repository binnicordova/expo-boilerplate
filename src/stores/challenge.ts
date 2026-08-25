import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";
import {CHALLENGES} from "@/constants/assessment";
import {STORAGE_ID} from "@/constants/storage";
import type {
    ChallengeDefinition,
    ChallengeResult,
    ChallengeStatus,
} from "@/models/progression";
import {api} from "@/services/api";
import {progressionAtom} from "@/stores/progression";
import {adaptiveDifficultyAtom} from "@/stores/quiz";
import {getLevel} from "@/utils/progression";
import {storage} from "@/utils/storage";

export const challengeResultsAtom = atomWithStorage<ChallengeResult[]>(
    STORAGE_ID.challengeResults,
    [],
    storage
);

export const activeChallengeAtom = atom<ChallengeDefinition | null>(null);
export const challengeStatusAtom = atom<ChallengeStatus>("idle");
export const challengeQuestionIdsAtom = atom<string[]>([]);
export const challengeIndexAtom = atom(0);
export const challengeCorrectAtom = atom(0);
export const challengeDeadlineAtom = atom<number | null>(null);

export const availableChallengesAtom = atom(() => CHALLENGES);

export const startChallengeAtom = atom(
    null,
    async (get, set, challengeId: string) => {
        const definition = CHALLENGES.find(
            (challenge) => challenge.id === challengeId
        );

        if (!definition) {
            return null;
        }

        const ids = await api.getSession({
            length: definition.questionCount,
            domain: definition.domain,
            difficulty: get(adaptiveDifficultyAtom),
        });

        set(activeChallengeAtom, definition);
        set(challengeQuestionIdsAtom, ids);
        set(challengeIndexAtom, 0);
        set(challengeCorrectAtom, 0);
        set(challengeStatusAtom, "running");
        set(
            challengeDeadlineAtom,
            Date.now() + definition.durationSeconds * 1000
        );

        return definition;
    }
);

export const advanceChallengeAtom = atom(
    null,
    (get, set, payload: {correct: boolean}) => {
        const definition = get(activeChallengeAtom);

        if (!definition || get(challengeStatusAtom) !== "running") {
            return;
        }

        const correct = get(challengeCorrectAtom) + (payload.correct ? 1 : 0);
        const index = get(challengeIndexAtom) + 1;

        set(challengeCorrectAtom, correct);
        set(challengeIndexAtom, index);

        if (index >= get(challengeQuestionIdsAtom).length) {
            set(
                challengeStatusAtom,
                correct >= definition.passingStreak ? "passed" : "failed"
            );
        }
    }
);

export const completeChallengeAtom = atom(
    null,
    async (get, set, outcome?: {timedOut?: boolean}) => {
        const definition = get(activeChallengeAtom);

        if (!definition) {
            return null;
        }

        const correct = get(challengeCorrectAtom);
        const answered = get(challengeIndexAtom);
        const passed =
            !outcome?.timedOut && correct >= definition.passingStreak;
        const xpAwarded = passed ? definition.durationSeconds : 0;

        const result: ChallengeResult = {
            challengeId: definition.id,
            answered,
            correct,
            passed,
            completedAt: new Date().toISOString(),
            xpAwarded,
        };

        set(challengeStatusAtom, passed ? "passed" : "failed");
        set(challengeDeadlineAtom, null);
        set(challengeResultsAtom, [
            ...(await get(challengeResultsAtom)),
            result,
        ]);

        if (xpAwarded) {
            const progression = await get(progressionAtom);
            const xp = progression.xp + xpAwarded;
            set(progressionAtom, {...progression, xp, level: getLevel(xp)});
        }

        return result;
    }
);

export const resetChallengeAtom = atom(null, (_get, set) => {
    set(activeChallengeAtom, null);
    set(challengeStatusAtom, "idle");
    set(challengeQuestionIdsAtom, []);
    set(challengeIndexAtom, 0);
    set(challengeCorrectAtom, 0);
    set(challengeDeadlineAtom, null);
});
