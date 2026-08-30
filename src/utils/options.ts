import type {Alternative} from "@/models/article";
import {shuffleWithSeed} from "./adaptive";

/**
 * Trims a choice question down to a shortlist that fits on screen without
 * scrolling. Every correct alternative is always kept — dropping one would
 * make the question impossible to answer — so the cap is a target, not a
 * guarantee, and at least one distractor always survives.
 */
export const narrowAlternatives = (
    alternatives: Alternative[],
    seed: string,
    maxOptions?: number
): Alternative[] => {
    if (!maxOptions || alternatives.length <= maxOptions) {
        return alternatives;
    }

    const correct = alternatives.filter(
        (alternative) => alternative.is_correct
    );
    const distractors = alternatives.filter(
        (alternative) => !alternative.is_correct
    );

    const distractorSlots = Math.max(maxOptions - correct.length, 1);

    return [
        ...correct,
        ...shuffleWithSeed(distractors, seed).slice(0, distractorSlots),
    ];
};
