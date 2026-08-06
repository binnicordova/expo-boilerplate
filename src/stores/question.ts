import {atom} from "jotai";
import type {Question} from "@/models/article";
import {api} from "@/services/api";

export const questionAtom = atom<Question | null>(null);
export const questionErrorAtom = atom<string | null>(null);
export const selectedAlternativeByQuestionAtom = atom<Record<string, string>>(
    {}
);

export const fetchQuestionAtom = atom(
    null,
    async (_get, set, questionId?: string) => {
        set(questionErrorAtom, null);

        try {
            const question = await api.getQuestion(questionId);
            set(questionAtom, question);
        } catch (error) {
            set(questionAtom, null);
            const message =
                error instanceof Error
                    ? error.message
                    : "Could not load question";
            set(questionErrorAtom, message);
        }
    }
);

export const selectAlternativeAtom = atom(
    null,
    (get, set, payload: {questionId: string; alternativeId: string}) => {
        const previousSelections = get(selectedAlternativeByQuestionAtom);
        set(selectedAlternativeByQuestionAtom, {
            ...previousSelections,
            [payload.questionId]: payload.alternativeId,
        });
    }
);

export const resetSelectedAlternativesAtom = atom(null, (_get, set) => {
    set(selectedAlternativeByQuestionAtom, {});
});
