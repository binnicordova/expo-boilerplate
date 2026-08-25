import {
    ADAPTIVE_WINDOW,
    DEMOTE_ACCURACY,
    PROMOTE_ACCURACY,
} from "@/constants/assessment";
import type {Difficulty} from "@/models/assessment";

const clampDifficulty = (value: number): Difficulty =>
    Math.min(2, Math.max(0, value)) as Difficulty;

export const getRollingAccuracy = (history: boolean[]): number => {
    const window = history.slice(-ADAPTIVE_WINDOW);

    if (!window.length) {
        return 0;
    }

    return window.filter(Boolean).length / window.length;
};

export const getNextDifficulty = (
    current: Difficulty,
    history: boolean[]
): Difficulty => {
    if (history.length < ADAPTIVE_WINDOW) {
        return current;
    }

    const accuracy = getRollingAccuracy(history);

    if (accuracy >= PROMOTE_ACCURACY) {
        return clampDifficulty(current + 1);
    }

    if (accuracy <= DEMOTE_ACCURACY) {
        return clampDifficulty(current - 1);
    }

    return current;
};

export const rankByAdaptiveFit = <T extends {difficulty: Difficulty}>(
    items: T[],
    target: Difficulty
): T[] =>
    [...items].sort(
        (a, b) =>
            Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target)
    );

const hashSeed = (seed: string): number => {
    let hash = 2166136261;

    for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
};

export const shuffleWithSeed = <T>(items: T[], seed: string): T[] => {
    const copy = [...items];
    let state = hashSeed(seed) || 1;

    const next = () => {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        state >>>= 0;
        return state / 0x100000000;
    };

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(next() * (index + 1));
        [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }

    return copy;
};
