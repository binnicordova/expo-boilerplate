import {atom} from "jotai";
import type {TranslationKey} from "@/i18n/types";
import type {AssessmentQuestion, AssessmentResponse} from "@/models/assessment";
import {isOrderingQuestion} from "@/models/assessment";
import {api} from "@/services/api";
import {getCorrectIds} from "@/utils/grading";

export const questionAtom = atom<AssessmentQuestion | null>(null);
export const questionErrorAtom = atom<TranslationKey | null>(null);
export const responseByQuestionAtom = atom<Record<string, AssessmentResponse>>(
    {}
);
export const revealedQuestionsAtom = atom<string[]>([]);

export const selectedAlternativeByQuestionAtom = atom((get) => {
    const responses = get(responseByQuestionAtom);

    return Object.entries(responses).reduce<Record<string, string>>(
        (accumulator, [questionId, response]) => {
            if (response.kind === "selection" && response.selectedIds[0]) {
                accumulator[questionId] = response.selectedIds[0];
            }

            return accumulator;
        },
        {}
    );
});

export const fetchQuestionAtom = atom(
    null,
    async (_get, set, questionId?: string) => {
        set(questionErrorAtom, null);

        if (!questionId) {
            set(questionAtom, null);
            return;
        }

        try {
            set(questionAtom, await api.getAssessment(questionId));
        } catch {
            set(questionAtom, null);
            set(questionErrorAtom, "practice.questionFailed");
        }
    }
);

const writeResponse = (
    responses: Record<string, AssessmentResponse>,
    questionId: string,
    response: AssessmentResponse
) => ({...responses, [questionId]: response});

export const selectAlternativeAtom = atom(
    null,
    (get, set, payload: {questionId: string; alternativeId: string}) => {
        set(
            responseByQuestionAtom,
            writeResponse(get(responseByQuestionAtom), payload.questionId, {
                kind: "selection",
                selectedIds: [payload.alternativeId],
            })
        );
    }
);

export const toggleAlternativeAtom = atom(
    null,
    (get, set, payload: {questionId: string; alternativeId: string}) => {
        const responses = get(responseByQuestionAtom);
        const current = responses[payload.questionId];
        const selected =
            current?.kind === "selection" ? current.selectedIds : [];

        const next = selected.includes(payload.alternativeId)
            ? selected.filter((id) => id !== payload.alternativeId)
            : [...selected, payload.alternativeId];

        set(
            responseByQuestionAtom,
            writeResponse(responses, payload.questionId, {
                kind: "selection",
                selectedIds: next,
            })
        );
    }
);

export const appendOrderedStepAtom = atom(
    null,
    (get, set, payload: {questionId: string; stepId: string}) => {
        const responses = get(responseByQuestionAtom);
        const current = responses[payload.questionId];
        const ordered = current?.kind === "ordering" ? current.orderedIds : [];

        const next = ordered.includes(payload.stepId)
            ? ordered.filter((id) => id !== payload.stepId)
            : [...ordered, payload.stepId];

        set(
            responseByQuestionAtom,
            writeResponse(responses, payload.questionId, {
                kind: "ordering",
                orderedIds: next,
            })
        );
    }
);

export const respondAtom = atom(
    null,
    (_get, set, payload: {question: AssessmentQuestion; targetId: string}) => {
        const {question, targetId} = payload;

        if (isOrderingQuestion(question)) {
            set(appendOrderedStepAtom, {
                questionId: question.id,
                stepId: targetId,
            });
            return;
        }

        if (question.format === "multiple-select") {
            set(toggleAlternativeAtom, {
                questionId: question.id,
                alternativeId: targetId,
            });
            return;
        }

        set(selectAlternativeAtom, {
            questionId: question.id,
            alternativeId: targetId,
        });
    }
);

export const revealQuestionAtom = atom(null, (get, set, questionId: string) => {
    const revealed = get(revealedQuestionsAtom);

    if (!revealed.includes(questionId)) {
        set(revealedQuestionsAtom, [...revealed, questionId]);
    }
});

export const resetSelectedAlternativesAtom = atom(null, (_get, set) => {
    set(responseByQuestionAtom, {});
    set(revealedQuestionsAtom, []);
});

export const correctIdsAtom = atom((get) => {
    const question = get(questionAtom);
    return question ? getCorrectIds(question) : [];
});
