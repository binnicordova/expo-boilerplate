import type {
    AssessmentQuestion,
    AssessmentResponse,
    GradeResult,
} from "@/models/assessment";
import {isOrderingQuestion} from "@/models/assessment";

const sameMembers = (left: string[], right: string[]): boolean =>
    left.length === right.length && left.every((id) => right.includes(id));

const sameSequence = (left: string[], right: string[]): boolean =>
    left.length === right.length &&
    left.every((id, index) => id === right[index]);

export const getCorrectIds = (question: AssessmentQuestion): string[] => {
    if (isOrderingQuestion(question)) {
        return [...question.steps]
            .sort((a, b) => a.position - b.position)
            .map((step) => step.id);
    }

    return question.alternatives
        .filter((alternative) => alternative.is_correct)
        .map((alternative) => alternative.id);
};

const gradeSelection = (
    selectedIds: string[],
    correctIds: string[]
): GradeResult => {
    const hits = selectedIds.filter((id) => correctIds.includes(id)).length;
    const misses = selectedIds.length - hits;
    const accuracy = correctIds.length
        ? Math.max(0, (hits - misses) / correctIds.length)
        : 0;

    return {
        correct: sameMembers(selectedIds, correctIds),
        accuracy,
        correctIds,
    };
};

const gradeOrdering = (
    orderedIds: string[],
    correctIds: string[]
): GradeResult => {
    const hits = correctIds.filter(
        (id, index) => orderedIds[index] === id
    ).length;

    return {
        correct: sameSequence(orderedIds, correctIds),
        accuracy: correctIds.length ? hits / correctIds.length : 0,
        correctIds,
    };
};

export const gradeQuestion = (
    question: AssessmentQuestion,
    response?: AssessmentResponse
): GradeResult => {
    const correctIds = getCorrectIds(question);

    if (!response) {
        return {correct: false, accuracy: 0, correctIds};
    }

    return response.kind === "ordering"
        ? gradeOrdering(response.orderedIds, correctIds)
        : gradeSelection(response.selectedIds, correctIds);
};

export const isResponseComplete = (
    question: AssessmentQuestion,
    response?: AssessmentResponse
): boolean => {
    if (!response) {
        return false;
    }

    if (isOrderingQuestion(question)) {
        return (
            response.kind === "ordering" &&
            response.orderedIds.length === question.steps.length
        );
    }

    return response.kind === "selection" && response.selectedIds.length > 0;
};
