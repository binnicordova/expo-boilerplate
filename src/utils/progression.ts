import {
    MASTERY_MIN_SAMPLE,
    MASTERY_TIERS,
    MAX_STREAK_MULTIPLIER,
    STREAK_BONUS_PER_DAY,
    XP_BY_DIFFICULTY,
    XP_PER_LEVEL,
} from "@/constants/assessment";
import type {Difficulty, Domain} from "@/models/assessment";
import type {
    Badge,
    DomainMastery,
    ProgressionState,
} from "@/models/progression";

export const INITIAL_PROGRESSION: ProgressionState = {
    xp: 0,
    level: 1,
    answered: 0,
    answeredByDifficulty: {},
    masteryByDomain: {},
    badges: [],
};

export const getAnsweredAtDifficulty = (
    state: ProgressionState,
    difficulty: Difficulty
): number => state.answeredByDifficulty?.[difficulty] ?? 0;

export const getStreakMultiplier = (streak: number): number =>
    Math.min(MAX_STREAK_MULTIPLIER, 1 + streak * STREAK_BONUS_PER_DAY);

export const getXpAward = (payload: {
    difficulty: Difficulty;
    accuracy: number;
    streak: number;
}): number => {
    const base = XP_BY_DIFFICULTY[payload.difficulty];
    const multiplier = getStreakMultiplier(payload.streak);
    return Math.round(base * payload.accuracy * multiplier);
};

export const getLevel = (xp: number): number =>
    Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);

export const getLevelProgress = (xp: number): number =>
    (xp % XP_PER_LEVEL) / XP_PER_LEVEL;

const emptyMastery = (domain: Domain): DomainMastery => ({
    domain,
    answered: 0,
    correct: 0,
    score: 0,
    difficultyReached: 0,
});

export const getMastery = (
    state: ProgressionState,
    domain: Domain
): DomainMastery => state.masteryByDomain[domain] ?? emptyMastery(domain);

export const applyMastery = (
    state: ProgressionState,
    payload: {domain: Domain; difficulty: Difficulty; correct: boolean}
): DomainMastery => {
    const current = getMastery(state, payload.domain);
    const answered = current.answered + 1;
    const correct = current.correct + (payload.correct ? 1 : 0);

    return {
        domain: payload.domain,
        answered,
        correct,
        score: correct / answered,
        difficultyReached: Math.max(
            current.difficultyReached,
            payload.difficulty
        ) as Difficulty,
    };
};

export const getBadgeTier = (mastery: DomainMastery): Badge["tier"] | null => {
    if (mastery.answered < MASTERY_MIN_SAMPLE) {
        return null;
    }

    return (
        MASTERY_TIERS.find((entry) => mastery.score >= entry.min)?.tier ?? null
    );
};

const TIER_RANK: Record<Badge["tier"], number> = {
    bronze: 1,
    silver: 2,
    gold: 3,
};

export const resolveBadges = (
    badges: Badge[],
    mastery: DomainMastery,
    reference: Date = new Date()
): Badge[] => {
    const tier = getBadgeTier(mastery);

    if (!tier) {
        return badges;
    }

    const existing = badges.find((badge) => badge.domain === mastery.domain);

    if (existing && TIER_RANK[existing.tier] >= TIER_RANK[tier]) {
        return badges;
    }

    const badge: Badge = {
        id: `${mastery.domain}-${tier}`,
        domain: mastery.domain,
        tier,
        unlockedAt: reference.toISOString(),
    };

    return [
        ...badges.filter((entry) => entry.domain !== mastery.domain),
        badge,
    ];
};

export const applyOutcome = (
    state: ProgressionState,
    payload: {
        domain: Domain;
        difficulty: Difficulty;
        correct: boolean;
        accuracy: number;
        streak: number;
    },
    reference: Date = new Date()
): ProgressionState => {
    const mastery = applyMastery(state, payload);
    const xp = state.xp + getXpAward(payload);

    return {
        xp,
        level: getLevel(xp),
        answered: (state.answered ?? 0) + 1,
        answeredByDifficulty: {
            ...state.answeredByDifficulty,
            [payload.difficulty]:
                getAnsweredAtDifficulty(state, payload.difficulty) + 1,
        },
        masteryByDomain: {
            ...state.masteryByDomain,
            [payload.domain]: mastery,
        },
        badges: resolveBadges(state.badges, mastery, reference),
    };
};
