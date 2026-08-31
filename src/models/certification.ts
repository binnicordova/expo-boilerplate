import type {TranslationRef} from "@/i18n/types";
import type {Difficulty, Domain} from "@/models/assessment";

export type ExamStatus =
    | "idle"
    | "loading"
    | "running"
    | "grading"
    | "complete"
    | "error";

export type ReadinessRequirement = {
    id: string;
    label: TranslationRef;
    current: number;
    target: number;
    met: boolean;
};

export type Readiness = {
    eligible: boolean;
    progress: number;
    requirements: ReadinessRequirement[];
};

export type DomainBreakdown = {
    domain: Domain;
    answered: number;
    correct: number;
    score: number;
};

export type DifficultyBreakdown = {
    difficulty: Difficulty;
    answered: number;
    correct: number;
    score: number;
};

export type ExamGrade = {
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    expertScore: number;
    weakestDomain: DomainBreakdown | null;
    failureReasons: TranslationRef[];
    byDomain: DomainBreakdown[];
    byDifficulty: DifficultyBreakdown[];
};

export type ExamAttempt = ExamGrade & {
    attemptId: string;
    userId: string;
    startedAt: string;
    submittedAt: string;
    durationSeconds: number;
    timedOut: boolean;
};

export type CooldownState = {
    blocked: boolean;
    availableAt: string | null;
    remainingMs: number;
};
