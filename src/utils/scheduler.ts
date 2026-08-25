import {
    REVIEW_EASE_DEFAULT,
    REVIEW_EASE_FLOOR,
    REVIEW_INTERVALS,
} from "@/constants/assessment";
import type {Domain} from "@/models/assessment";
import type {ReviewCard} from "@/models/progression";
import {addDays, isDue} from "@/utils/date";

const intervalForRepetition = (repetitions: number, easeFactor: number) => {
    if (repetitions <= REVIEW_INTERVALS.length) {
        return REVIEW_INTERVALS[repetitions - 1];
    }

    const previous = REVIEW_INTERVALS[REVIEW_INTERVALS.length - 1];
    return Math.round(
        previous * easeFactor ** (repetitions - REVIEW_INTERVALS.length)
    );
};

const nextEaseFactor = (easeFactor: number, accuracy: number) => {
    const delta = 0.1 - (1 - accuracy) * 0.5;
    return Math.max(REVIEW_EASE_FLOOR, Number((easeFactor + delta).toFixed(2)));
};

export const createReviewCard = (
    questionId: string,
    domain: Domain,
    reference: Date = new Date()
): ReviewCard => ({
    questionId,
    domain,
    repetitions: 0,
    intervalDays: 0,
    easeFactor: REVIEW_EASE_DEFAULT,
    dueAt: reference.toISOString(),
    lastReviewedAt: reference.toISOString(),
});

export const scheduleReview = (
    card: ReviewCard,
    outcome: {correct: boolean; accuracy: number},
    reference: Date = new Date()
): ReviewCard => {
    const easeFactor = nextEaseFactor(card.easeFactor, outcome.accuracy);

    if (!outcome.correct) {
        return {
            ...card,
            repetitions: 0,
            intervalDays: 1,
            easeFactor,
            dueAt: addDays(reference, 1).toISOString(),
            lastReviewedAt: reference.toISOString(),
        };
    }

    const repetitions = card.repetitions + 1;
    const intervalDays = intervalForRepetition(repetitions, easeFactor);

    return {
        ...card,
        repetitions,
        intervalDays,
        easeFactor,
        dueAt: addDays(reference, intervalDays).toISOString(),
        lastReviewedAt: reference.toISOString(),
    };
};

export const getDueCards = (
    cards: Record<string, ReviewCard>,
    reference: Date = new Date()
): ReviewCard[] =>
    Object.values(cards)
        .filter((card) => isDue(card.dueAt, reference))
        .sort(
            (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
        );
