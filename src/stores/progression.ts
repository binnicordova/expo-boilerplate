import {atom} from "jotai";
import {atomWithStorage, unwrap} from "jotai/utils";
import {STORAGE_ID} from "@/constants/storage";
import type {Difficulty, Domain} from "@/models/assessment";
import type {ProgressionState} from "@/models/progression";
import {
    applyOutcome,
    getLevelProgress,
    INITIAL_PROGRESSION,
} from "@/utils/progression";
import {resolveSkillTree} from "@/utils/skillTree";
import {storage} from "@/utils/storage";

export const progressionAtom = atomWithStorage<ProgressionState>(
    STORAGE_ID.progression,
    INITIAL_PROGRESSION,
    storage
);

export const progressionValueAtom = unwrap(
    progressionAtom,
    (previous) => previous ?? INITIAL_PROGRESSION
);

export const xpAtom = atom((get) => get(progressionValueAtom).xp);

export const levelAtom = atom((get) => get(progressionValueAtom).level);

export const levelProgressAtom = atom((get) =>
    getLevelProgress(get(progressionValueAtom).xp)
);

export const badgesAtom = atom((get) => get(progressionValueAtom).badges);

export const skillTreeAtom = atom((get) =>
    resolveSkillTree(get(progressionValueAtom))
);

export type OutcomePayload = {
    domain: Domain;
    difficulty: Difficulty;
    correct: boolean;
    accuracy: number;
    streak: number;
};

export const recordOutcomeAtom = atom(
    null,
    async (get, set, payload: OutcomePayload) => {
        const current = await get(progressionAtom);
        const next = applyOutcome(current, payload);

        set(progressionAtom, next);

        const knownBadgeIds = new Set(current.badges.map((badge) => badge.id));

        return {
            xpAwarded: next.xp - current.xp,
            leveledUp: next.level > current.level,
            unlockedBadge:
                next.badges.find((badge) => !knownBadgeIds.has(badge.id)) ??
                null,
        };
    }
);
