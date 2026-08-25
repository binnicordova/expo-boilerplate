import type {Difficulty} from "@/models/assessment";

export const EXAM_BLUEPRINT: {difficulty: Difficulty; count: number}[] = [
    {difficulty: 0, count: 5},
    {difficulty: 1, count: 12},
    {difficulty: 2, count: 8},
];

export const EXAM_LENGTH = EXAM_BLUEPRINT.reduce(
    (total, slot) => total + slot.count,
    0
);

export const EXAM_DURATION_SECONDS = 25 * 60;
export const EXAM_MIN_DOMAINS = 3;
export const EXAM_MAX_DOMAIN_SHARE = 0.4;

export const PASS_OVERALL = 0.8;
export const PASS_EXPERT = 0.6;
export const PASS_PER_DOMAIN = 0.5;

export const CERTIFICATION_VALIDITY_MONTHS = 6;

export const COOLDOWN_HOURS = [24, 72, 168];

export const ELIGIBILITY = {
    answered: 60,
    expertAnswered: 12,
    masteredDomains: 3,
    domainMastery: 0.6,
    streakDays: 3,
};

export const PRACTICE_BATCH = 10;
export const PRACTICE_PREFETCH_THRESHOLD = 3;
export const CHECKPOINT_INTERVAL = 10;
export const DAILY_GOAL_CORRECT = 15;
