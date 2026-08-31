import type {TranslationKey} from "@/i18n/types";
import type {Difficulty, Domain} from "@/models/assessment";

export type DeviceIdentity = {
    id: string;
    vendorId: string | null;
    installedAt: string;
};

export type ReviewCard = {
    questionId: string;
    domain: Domain;
    repetitions: number;
    intervalDays: number;
    easeFactor: number;
    dueAt: string;
    lastReviewedAt: string;
};

export type StreakState = {
    currentStreak: number;
    longestStreak: number;
    lastActiveDay: string | null;
    daysCertified: number;
    todayAnswered: number;
    todayCorrect: number;
    goalMetDays: number;
    lastGoalDay: string | null;
};

export type DomainMastery = {
    domain: Domain;
    answered: number;
    correct: number;
    score: number;
    difficultyReached: Difficulty;
};

export type BadgeTier = "bronze" | "silver" | "gold";

export type Badge = {
    id: string;
    domain: Domain;
    tier: BadgeTier;
    unlockedAt: string;
};

export type ProgressionState = {
    xp: number;
    level: number;
    answered: number;
    answeredByDifficulty: Record<string, number>;
    masteryByDomain: Record<string, DomainMastery>;
    badges: Badge[];
};

export type SkillNode = {
    id: string;
    domain: Domain;
    labelKey: TranslationKey;
    dependsOn: string[];
    masteryRequired: number;
};

export type SkillNodeStatus = "locked" | "available" | "mastered";

export type SkillNodeView = SkillNode & {
    status: SkillNodeStatus;
    progress: number;
};

export type ChallengeStatus = "idle" | "running" | "passed" | "failed";

export type ChallengeDefinition = {
    id: string;
    domain: Domain;
    labelKey: TranslationKey;
    durationSeconds: number;
    questionCount: number;
    passingStreak: number;
};

export type ChallengeResult = {
    challengeId: string;
    answered: number;
    correct: number;
    passed: boolean;
    completedAt: string;
    xpAwarded: number;
};
