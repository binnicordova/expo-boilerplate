import type {Alternative} from "@/models/article";
import {narrowAlternatives} from "./options";

const alternative = (id: string, is_correct = false): Alternative => ({
    id,
    text: `option ${id}`,
    is_correct,
});

const singleAnswer = [
    alternative("a", true),
    alternative("b"),
    alternative("c"),
    alternative("d"),
    alternative("e"),
    alternative("f"),
];

describe("narrowAlternatives", () => {
    it("returns the alternatives untouched when no cap is given", () => {
        expect(narrowAlternatives(singleAnswer, "seed")).toEqual(singleAnswer);
    });

    it("returns the alternatives untouched when already within the cap", () => {
        const three = singleAnswer.slice(0, 3);

        expect(narrowAlternatives(three, "seed", 3)).toEqual(three);
    });

    it("caps the shortlist at the requested size", () => {
        expect(narrowAlternatives(singleAnswer, "seed", 3)).toHaveLength(3);
    });

    it("always keeps the correct alternative", () => {
        const kept = narrowAlternatives(singleAnswer, "seed", 3);

        expect(kept.filter((entry) => entry.is_correct)).toHaveLength(1);
    });

    it("keeps every correct alternative for multiple-select questions", () => {
        const multiSelect = [
            alternative("a", true),
            alternative("b", true),
            alternative("c", true),
            alternative("d"),
            alternative("e"),
            alternative("f"),
        ];

        const kept = narrowAlternatives(multiSelect, "seed", 3);

        expect(kept.filter((entry) => entry.is_correct)).toHaveLength(3);
    });

    it("keeps at least one distractor even when the correct set fills the cap", () => {
        const multiSelect = [
            alternative("a", true),
            alternative("b", true),
            alternative("c", true),
            alternative("d"),
            alternative("e"),
        ];

        const kept = narrowAlternatives(multiSelect, "seed", 3);

        expect(
            kept.filter((entry) => !entry.is_correct).length
        ).toBeGreaterThan(0);
        expect(kept).toHaveLength(4);
    });

    it("picks the same shortlist for the same seed", () => {
        expect(narrowAlternatives(singleAnswer, "seed", 3)).toEqual(
            narrowAlternatives(singleAnswer, "seed", 3)
        );
    });

    it("varies the distractors across questions", () => {
        const first = narrowAlternatives(singleAnswer, "question-1", 3);
        const second = narrowAlternatives(singleAnswer, "question-42", 3);

        expect(first.map((entry) => entry.id)).not.toEqual(
            second.map((entry) => entry.id)
        );
    });
});
