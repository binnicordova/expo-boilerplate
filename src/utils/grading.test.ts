import type {AssessmentQuestion} from "@/models/assessment";
import {getCorrectIds, gradeQuestion, isResponseComplete} from "./grading";

const digest = {headline: "h", body: "b"};

const multipleChoice: AssessmentQuestion = {
    id: "mc",
    topicId: "mc",
    domain: "react",
    difficulty: 0,
    format: "multiple-choice",
    prompt: "prompt",
    digest,
    alternatives: [
        {id: "a", text: "a", is_correct: true},
        {id: "b", text: "b", is_correct: false},
    ],
};

const multipleSelect: AssessmentQuestion = {
    id: "ms",
    topicId: "ms",
    domain: "react",
    difficulty: 1,
    format: "multiple-select",
    prompt: "prompt",
    digest,
    alternatives: [
        {id: "a", text: "a", is_correct: true},
        {id: "b", text: "b", is_correct: true},
        {id: "c", text: "c", is_correct: false},
    ],
};

const ordering: AssessmentQuestion = {
    id: "ord",
    topicId: "ord",
    domain: "node",
    difficulty: 2,
    format: "ordering",
    prompt: "prompt",
    digest,
    steps: [
        {id: "s2", text: "second", position: 1},
        {id: "s1", text: "first", position: 0},
        {id: "s3", text: "third", position: 2},
    ],
};

describe("getCorrectIds", () => {
    it("returns correct alternatives for choice questions", () => {
        expect(getCorrectIds(multipleSelect)).toEqual(["a", "b"]);
    });

    it("returns ordering steps sorted by position", () => {
        expect(getCorrectIds(ordering)).toEqual(["s1", "s2", "s3"]);
    });
});

describe("gradeQuestion", () => {
    it("marks a missing response as incorrect", () => {
        expect(gradeQuestion(multipleChoice)).toMatchObject({
            correct: false,
            accuracy: 0,
        });
    });

    it("grades a correct single choice", () => {
        const result = gradeQuestion(multipleChoice, {
            kind: "selection",
            selectedIds: ["a"],
        });

        expect(result.correct).toBe(true);
        expect(result.accuracy).toBe(1);
    });

    it("requires every correct option for multiple select", () => {
        const partial = gradeQuestion(multipleSelect, {
            kind: "selection",
            selectedIds: ["a"],
        });

        expect(partial.correct).toBe(false);
        expect(partial.accuracy).toBeCloseTo(0.5);

        const complete = gradeQuestion(multipleSelect, {
            kind: "selection",
            selectedIds: ["b", "a"],
        });

        expect(complete.correct).toBe(true);
    });

    it("penalises incorrect picks in multiple select", () => {
        const result = gradeQuestion(multipleSelect, {
            kind: "selection",
            selectedIds: ["a", "c"],
        });

        expect(result.correct).toBe(false);
        expect(result.accuracy).toBe(0);
    });

    it("requires the exact sequence for ordering", () => {
        expect(
            gradeQuestion(ordering, {
                kind: "ordering",
                orderedIds: ["s1", "s2", "s3"],
            }).correct
        ).toBe(true);

        const swapped = gradeQuestion(ordering, {
            kind: "ordering",
            orderedIds: ["s2", "s1", "s3"],
        });

        expect(swapped.correct).toBe(false);
        expect(swapped.accuracy).toBeCloseTo(1 / 3);
    });
});

describe("isResponseComplete", () => {
    it("requires at least one selection", () => {
        expect(
            isResponseComplete(multipleChoice, {
                kind: "selection",
                selectedIds: [],
            })
        ).toBe(false);
    });

    it("requires every step to be placed", () => {
        expect(
            isResponseComplete(ordering, {
                kind: "ordering",
                orderedIds: ["s1", "s2"],
            })
        ).toBe(false);

        expect(
            isResponseComplete(ordering, {
                kind: "ordering",
                orderedIds: ["s1", "s2", "s3"],
            })
        ).toBe(true);
    });
});
