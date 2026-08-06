import {atom} from "jotai";
import {api} from "@/services/api";
import {selectedAlternativeByQuestionAtom} from "@/stores/question";
import {
    ensureUserAtom,
    setCertificationForCurrentUserAtom,
    userAtom,
} from "@/stores/user";

type QuizStatus = "idle" | "loading" | "ready" | "error";

export const quizAtom = atom<string[]>([]);
export const currentQuestionIndexAtom = atom(0);
export const quizStatusAtom = atom<QuizStatus>("idle");
export const quizErrorAtom = atom<string | null>(null);

export const initializeQuizAtom = atom(null, async (_get, set) => {
    set(quizStatusAtom, "loading");
    set(quizErrorAtom, null);

    try {
        const quiz = await api.getQuiz();
        set(quizAtom, quiz);
        set(currentQuestionIndexAtom, 0);
        set(quizStatusAtom, "ready");
    } catch (error) {
        set(quizStatusAtom, "error");
        const message =
            error instanceof Error ? error.message : "Could not load the quiz";
        set(quizErrorAtom, message);
    }
});

export const goToNextQuestionAtom = atom(null, (get, set) => {
    const ids = get(quizAtom);
    const currentIndex = get(currentQuestionIndexAtom);

    if (currentIndex < ids.length - 1) {
        set(currentQuestionIndexAtom, currentIndex + 1);
    }
});

export const finalizeQuizAtom = atom(null, async (get, set) => {
    console.log("Finalizing quiz...");
    await set(ensureUserAtom);

    // Get the user after calling set(ensureUserAtom) to make sure we have the persisted ID
    const user = await get(userAtom);
    const ids = get(quizAtom);
    const selections = get(selectedAlternativeByQuestionAtom);

    console.log("finalizeQuizAtom captured user:", user);

    if (!user?.id || !ids.length) {
        return {
            userId: user?.id || "no-user-id",
            score: 0,
            total: ids.length,
        };
    }

    let correct = 0;

    for (const id of ids) {
        try {
            const question = await api.getQuestion(id);
            const selected = selections[question.id];
            const correctAlternative = question.alternatives.find(
                (alternative) => alternative.is_correct
            );

            if (
                selected &&
                correctAlternative &&
                selected === correctAlternative.id
            ) {
                correct += 1;
            }
        } catch (_error) {
            // If a question fails to load, it is counted as incorrect.
        }
    }

    await set(setCertificationForCurrentUserAtom, {
        score: correct,
        total: ids.length,
    });

    return {
        userId: user.id,
        score: correct,
        total: ids.length,
    };
});
