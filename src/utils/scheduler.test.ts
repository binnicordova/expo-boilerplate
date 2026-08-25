import {createReviewCard, getDueCards, scheduleReview} from "./scheduler";

const at = (iso: string) => new Date(`${iso}T10:00:00`);

const daysApart = (from: Date, iso: string) =>
    Math.round((new Date(iso).getTime() - from.getTime()) / 86_400_000);

describe("scheduleReview", () => {
    it("expands the interval on each correct answer", () => {
        const start = at("2026-03-01");
        let card = createReviewCard("q1", "react", start);

        card = scheduleReview(card, {correct: true, accuracy: 1}, start);
        expect(card.repetitions).toBe(1);
        expect(daysApart(start, card.dueAt)).toBe(1);

        card = scheduleReview(card, {correct: true, accuracy: 1}, start);
        expect(daysApart(start, card.dueAt)).toBe(3);

        card = scheduleReview(card, {correct: true, accuracy: 1}, start);
        expect(daysApart(start, card.dueAt)).toBe(7);
    });

    it("resets to a one day interval after a miss", () => {
        const start = at("2026-03-01");
        let card = createReviewCard("q1", "react", start);

        card = scheduleReview(card, {correct: true, accuracy: 1}, start);
        card = scheduleReview(card, {correct: true, accuracy: 1}, start);
        card = scheduleReview(card, {correct: false, accuracy: 0}, start);

        expect(card.repetitions).toBe(0);
        expect(daysApart(start, card.dueAt)).toBe(1);
    });

    it("never lets the ease factor fall below the floor", () => {
        const start = at("2026-03-01");
        let card = createReviewCard("q1", "typescript", start);

        for (let index = 0; index < 20; index += 1) {
            card = scheduleReview(card, {correct: false, accuracy: 0}, start);
        }

        expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
    });
});

describe("getDueCards", () => {
    it("returns only cards past their due date, earliest first", () => {
        const start = at("2026-03-01");

        const overdue = scheduleReview(
            createReviewCard("overdue", "react", start),
            {correct: true, accuracy: 1},
            start
        );

        const future = scheduleReview(
            createReviewCard("future", "node", start),
            {correct: true, accuracy: 1},
            at("2026-03-10")
        );

        const due = getDueCards({overdue, future}, at("2026-03-05"));

        expect(due.map((card) => card.questionId)).toEqual(["overdue"]);
    });
});
