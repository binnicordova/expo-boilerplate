import {
    COOLDOWN_HOURS,
    ELIGIBILITY,
    PASS_EXPERT,
    PASS_OVERALL,
    PASS_PER_DOMAIN,
} from "@/constants/certification";
import type {TranslationRef} from "@/i18n/types";
import type {
    AssessmentQuestion,
    AssessmentResponse,
    Difficulty,
    Domain,
} from "@/models/assessment";
import type {
    CooldownState,
    DifficultyBreakdown,
    DomainBreakdown,
    ExamAttempt,
    ExamGrade,
    Readiness,
    ReadinessRequirement,
} from "@/models/certification";
import type {ProgressionState} from "@/models/progression";
import {gradeQuestion} from "@/utils/grading";
import {getAnsweredAtDifficulty} from "@/utils/progression";

const ratio = (current: number, target: number) =>
    target <= 0 ? 1 : Math.min(1, current / target);

export const getReadiness = (
    progression: ProgressionState,
    streak: number
): Readiness => {
    const masteries = Object.values(progression.masteryByDomain);

    const answered =
        progression.answered ??
        masteries.reduce((total, mastery) => total + mastery.answered, 0);

    const expertAnswered = getAnsweredAtDifficulty(progression, 2);

    const masteredDomains = masteries.filter(
        (mastery) => mastery.score >= ELIGIBILITY.domainMastery
    ).length;

    const requirements: ReadinessRequirement[] = [
        {
            id: "answered",
            label: {key: "readiness.requirement.answered"},
            current: answered,
            target: ELIGIBILITY.answered,
            met: answered >= ELIGIBILITY.answered,
        },
        {
            id: "expert",
            label: {key: "readiness.requirement.expert"},
            current: expertAnswered,
            target: ELIGIBILITY.expertAnswered,
            met: expertAnswered >= ELIGIBILITY.expertAnswered,
        },
        {
            id: "domains",
            label: {
                key: "readiness.requirement.domains",
                params: {
                    percentage: Math.round(ELIGIBILITY.domainMastery * 100),
                },
            },
            current: masteredDomains,
            target: ELIGIBILITY.masteredDomains,
            met: masteredDomains >= ELIGIBILITY.masteredDomains,
        },
        {
            id: "streak",
            label: {key: "readiness.requirement.streak"},
            current: streak,
            target: ELIGIBILITY.streakDays,
            met: streak >= ELIGIBILITY.streakDays,
        },
    ];

    const progress =
        requirements.reduce(
            (total, requirement) =>
                total + ratio(requirement.current, requirement.target),
            0
        ) / requirements.length;

    return {
        eligible: requirements.every((requirement) => requirement.met),
        progress,
        requirements,
    };
};

const summarize = <K extends string | number>(
    entries: {key: K; correct: boolean}[]
) => {
    const grouped = new Map<K, {answered: number; correct: number}>();

    for (const entry of entries) {
        const current = grouped.get(entry.key) ?? {answered: 0, correct: 0};

        grouped.set(entry.key, {
            answered: current.answered + 1,
            correct: current.correct + (entry.correct ? 1 : 0),
        });
    }

    return grouped;
};

export const gradeExam = (
    questions: AssessmentQuestion[],
    responses: Record<string, AssessmentResponse>
): ExamGrade => {
    const outcomes = questions.map((question) => ({
        question,
        correct: gradeQuestion(question, responses[question.id]).correct,
    }));

    const total = outcomes.length;
    const score = outcomes.filter((outcome) => outcome.correct).length;
    const percentage = total ? Math.round((score / total) * 100) : 0;

    const byDomain: DomainBreakdown[] = [
        ...summarize(
            outcomes.map((outcome) => ({
                key: outcome.question.domain as Domain,
                correct: outcome.correct,
            }))
        ),
    ].map(([domain, value]) => ({
        domain,
        answered: value.answered,
        correct: value.correct,
        score: value.correct / value.answered,
    }));

    const byDifficulty: DifficultyBreakdown[] = [
        ...summarize(
            outcomes.map((outcome) => ({
                key: outcome.question.difficulty as Difficulty,
                correct: outcome.correct,
            }))
        ),
    ]
        .map(([difficulty, value]) => ({
            difficulty,
            answered: value.answered,
            correct: value.correct,
            score: value.correct / value.answered,
        }))
        .sort((a, b) => a.difficulty - b.difficulty);

    const expert = byDifficulty.find((entry) => entry.difficulty === 2);
    const expertScore = expert?.score ?? 0;

    const weakestDomain = byDomain.length
        ? byDomain.reduce((weakest, entry) =>
              entry.score < weakest.score ? entry : weakest
          )
        : null;

    const overallRatio = total ? score / total : 0;
    const failureReasons: TranslationRef[] = [];

    if (overallRatio < PASS_OVERALL) {
        failureReasons.push({
            key: "exam.failure.overall",
            params: {
                percentage,
                passMark: Math.round(PASS_OVERALL * 100),
            },
        });
    }

    if (expert && expertScore < PASS_EXPERT) {
        failureReasons.push({
            key: "exam.failure.expert",
            params: {
                percentage: Math.round(expertScore * 100),
                passMark: Math.round(PASS_EXPERT * 100),
            },
        });
    }

    for (const entry of byDomain) {
        if (entry.score < PASS_PER_DOMAIN) {
            failureReasons.push({
                key: "exam.failure.domain",
                params: {
                    domain: entry.domain,
                    percentage: Math.round(entry.score * 100),
                    passMark: Math.round(PASS_PER_DOMAIN * 100),
                },
            });
        }
    }

    return {
        score,
        total,
        percentage,
        passed: failureReasons.length === 0 && total > 0,
        expertScore,
        weakestDomain,
        failureReasons,
        byDomain,
        byDifficulty,
    };
};

export const getCooldown = (
    attempts: ExamAttempt[],
    reference: Date = new Date()
): CooldownState => {
    const failures: ExamAttempt[] = [];

    for (let index = attempts.length - 1; index >= 0; index -= 1) {
        const attempt = attempts[index];

        if (attempt.passed) {
            break;
        }

        failures.push(attempt);
    }

    const last = failures[0];

    if (!last) {
        return {blocked: false, availableAt: null, remainingMs: 0};
    }

    const hours =
        COOLDOWN_HOURS[
            Math.min(failures.length - 1, COOLDOWN_HOURS.length - 1)
        ];

    const availableAt = new Date(
        new Date(last.submittedAt).getTime() + hours * 3_600_000
    );

    const remainingMs = availableAt.getTime() - reference.getTime();

    return {
        blocked: remainingMs > 0,
        availableAt: availableAt.toISOString(),
        remainingMs: Math.max(0, remainingMs),
    };
};

export const formatCooldown = (remainingMs: number): TranslationRef => {
    const totalMinutes = Math.ceil(remainingMs / 60_000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours >= 24) {
        return {key: "cooldown.days", params: {days: Math.ceil(hours / 24)}};
    }

    return hours > 0
        ? {key: "cooldown.hours", params: {hours, minutes}}
        : {key: "cooldown.minutes", params: {minutes}};
};
