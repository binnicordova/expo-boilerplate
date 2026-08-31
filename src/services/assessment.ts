import {
    EXAM_BLUEPRINT,
    EXAM_MAX_DOMAIN_SHARE,
    EXAM_MIN_DOMAINS,
} from "@/constants/certification";
import type {Question} from "@/models/article";
import type {AssessmentQuestion, Difficulty, Domain} from "@/models/assessment";
import type {Content} from "@/models/content";
import {AUTHORED_ASSESSMENTS} from "@/services/mocks/en-assessments";
import {rankByAdaptiveFit} from "@/utils/adaptive";
import {summarize} from "@/utils/html";
import content from "./mocks/es-content.json";
import questions from "./mocks/es-questions.json";

const LEGACY_DOMAIN: Domain = "react";

export type QuestionIndexEntry = {
    id: string;
    topicId: string;
    domain: Domain;
    difficulty: Difficulty;
};

const toDifficulty = (level: number): Difficulty => {
    if (level <= 0) {
        return level < 0 ? 1 : 0;
    }

    return level >= 2 ? 2 : 1;
};

const contentById = new Map<string, Content>(
    (content as Content[]).map((entry) => [entry.id, entry])
);

const legacyById = new Map<string, Question>(
    (questions as Question[]).map((entry) => [entry.id, entry])
);

const authoredById = new Map<string, AssessmentQuestion>(
    AUTHORED_ASSESSMENTS.map((entry) => [entry.id, entry])
);

const adaptedCache = new Map<string, AssessmentQuestion>();

const adaptLegacyQuestion = (legacy: Question): AssessmentQuestion => {
    const article = contentById.get(legacy.question_id);

    return {
        id: legacy.id,
        topicId: legacy.question_id,
        domain: LEGACY_DOMAIN,
        difficulty: toDifficulty(article?.level ?? 1),
        format: "multiple-choice",
        prompt: legacy.question,
        alternatives: legacy.alternatives,
        digest: {
            headline: article?.title ?? legacy.question,
            body: article
                ? summarize(article.content)
                : "Review the related documentation for this topic.",
            reference: article?.title,
        },
    };
};

export const INDEX: QuestionIndexEntry[] = [
    ...(questions as Question[]).map((legacy) => ({
        id: legacy.id,
        topicId: legacy.question_id,
        domain: LEGACY_DOMAIN,
        difficulty: toDifficulty(
            contentById.get(legacy.question_id)?.level ?? 1
        ),
    })),
    ...AUTHORED_ASSESSMENTS.map((entry) => ({
        id: entry.id,
        topicId: entry.topicId,
        domain: entry.domain,
        difficulty: entry.difficulty,
    })),
];

export const getAssessmentQuestion = (
    id: string
): AssessmentQuestion | null => {
    const authored = authoredById.get(id);

    if (authored) {
        return authored;
    }

    const cached = adaptedCache.get(id);

    if (cached) {
        return cached;
    }

    const legacy = legacyById.get(id);

    if (!legacy) {
        return null;
    }

    const adapted = adaptLegacyQuestion(legacy);
    adaptedCache.set(id, adapted);
    return adapted;
};

export const getDomains = (): Domain[] => [
    ...new Set(INDEX.map((entry) => entry.domain)),
];

const shuffle = <T>(items: T[]): T[] => {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }

    return copy;
};

export type SessionRequest = {
    length?: number;
    domain?: Domain;
    difficulty?: Difficulty;
    reviewIds?: string[];
    excludeIds?: string[];
};

export const buildSession = (request: SessionRequest = {}): string[] => {
    const {
        length = 5,
        domain,
        difficulty = 0,
        reviewIds = [],
        excludeIds = [],
    } = request;

    const excluded = new Set(excludeIds);
    const known = new Set(INDEX.map((entry) => entry.id));

    const review = reviewIds.filter((id) => known.has(id) && !excluded.has(id));

    const selected = review.slice(0, length);
    const taken = new Set(selected);

    const pool = INDEX.filter(
        (entry) =>
            !taken.has(entry.id) &&
            !excluded.has(entry.id) &&
            (!domain || entry.domain === domain)
    );

    const ranked = rankByAdaptiveFit(shuffle(pool), difficulty);

    for (const entry of ranked) {
        if (selected.length >= length) {
            break;
        }

        selected.push(entry.id);
    }

    return selected;
};

export type ExamRequest = {
    blueprint?: {difficulty: Difficulty; count: number}[];
    minDomains?: number;
    maxDomainShare?: number;
};

export const buildExam = (request: ExamRequest = {}): string[] => {
    const {
        blueprint = EXAM_BLUEPRINT,
        minDomains = EXAM_MIN_DOMAINS,
        maxDomainShare = EXAM_MAX_DOMAIN_SHARE,
    } = request;

    const length = blueprint.reduce((total, slot) => total + slot.count, 0);
    const domainCap = Math.max(1, Math.floor(length * maxDomainShare));

    const selected: QuestionIndexEntry[] = [];
    const domainCounts = new Map<Domain, number>();

    const take = (entry: QuestionIndexEntry) => {
        selected.push(entry);
        domainCounts.set(
            entry.domain,
            (domainCounts.get(entry.domain) ?? 0) + 1
        );
    };

    for (const slot of blueprint) {
        const pool = shuffle(
            INDEX.filter((entry) => entry.difficulty === slot.difficulty)
        );

        let filled = 0;

        for (const entry of pool) {
            if (filled >= slot.count) {
                break;
            }

            if ((domainCounts.get(entry.domain) ?? 0) >= domainCap) {
                continue;
            }

            take(entry);
            filled += 1;
        }

        for (const entry of pool) {
            if (filled >= slot.count) {
                break;
            }

            if (selected.includes(entry)) {
                continue;
            }

            take(entry);
            filled += 1;
        }
    }

    if (domainCounts.size < minDomains) {
        const missing = INDEX.filter(
            (entry) => !domainCounts.has(entry.domain)
        );

        for (const entry of shuffle(missing)) {
            if (domainCounts.size >= minDomains || !selected.length) {
                break;
            }

            const overweight = [...domainCounts.entries()].sort(
                (a, b) => b[1] - a[1]
            )[0];

            const victim = selected.findIndex(
                (candidate) => candidate.domain === overweight[0]
            );

            if (victim < 0) {
                break;
            }

            selected.splice(victim, 1);
            domainCounts.set(overweight[0], overweight[1] - 1);

            if (!domainCounts.get(overweight[0])) {
                domainCounts.delete(overweight[0]);
            }

            take(entry);
        }
    }

    return shuffle(selected).map((entry) => entry.id);
};
