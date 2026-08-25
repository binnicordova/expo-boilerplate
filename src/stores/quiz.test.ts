import {createStore} from "jotai";
import {getAssessmentQuestion} from "@/services/assessment";
import {progressionAtom} from "@/stores/progression";
import {questionAtom, respondAtom} from "@/stores/question";
import {
    adaptiveDifficultyAtom,
    checkpointAtom,
    currentQuestionIndexAtom,
    dismissCheckpointAtom,
    goToNextQuestionAtom,
    initializeQuizAtom,
    lastFeedbackAtom,
    quizAtom,
    quizStatusAtom,
    submitAnswerAtom,
} from "@/stores/quiz";
import {reviewQueueAtom, streakAtom} from "@/stores/retention";
import {userAtom} from "@/stores/user";
import {getCorrectIds} from "@/utils/grading";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("expo-application", () => ({
    applicationId: "com.expofs.test",
    getAndroidId: () => "android-test-id",
    getIosIdForVendorAsync: async () => "ios-vendor-test-id",
}));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("assessment session", () => {
    it("builds a session and assigns a device-derived user id", async () => {
        const store = createStore();

        await store.set(initializeQuizAtom, {length: 4});
        await flush();

        expect(store.get(quizStatusAtom)).toBe("ready");
        expect(store.get(quizAtom)).toHaveLength(4);

        const user = await store.get(userAtom);
        expect(user.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
        );
    });

    it("awards xp, opens a streak, and schedules a review on a correct answer", async () => {
        const store = createStore();

        await store.set(initializeQuizAtom, {length: 3});
        await flush();

        const questionId = store.get(quizAtom)[0];
        const question = getAssessmentQuestion(questionId);

        if (!question) {
            throw new Error("expected a question");
        }

        store.set(questionAtom, question);

        for (const correctId of getCorrectIds(question)) {
            store.set(respondAtom, {question, targetId: correctId});
        }

        const feedback = await store.set(submitAnswerAtom, question);

        expect(feedback.correct).toBe(true);
        expect(feedback.xpAwarded).toBeGreaterThan(0);

        const progression = await store.get(progressionAtom);
        expect(progression.xp).toBe(feedback.xpAwarded);
        expect(progression.masteryByDomain[question.domain]).toMatchObject({
            answered: 1,
            correct: 1,
        });

        const streak = await store.get(streakAtom);
        expect(streak.currentStreak).toBe(1);

        const queue = await store.get(reviewQueueAtom);
        expect(queue[question.id]).toMatchObject({repetitions: 1});
    });

    it("reschedules a missed question for the next day", async () => {
        const store = createStore();

        await store.set(initializeQuizAtom, {length: 3});
        await flush();

        const question = getAssessmentQuestion(store.get(quizAtom)[0]);

        if (!question) {
            throw new Error("expected a question");
        }

        const correctIds = getCorrectIds(question);
        const wrongId =
            question.format === "ordering"
                ? [...correctIds].reverse()[0]
                : question.alternatives.find(
                      (alternative) => !alternative.is_correct
                  )?.id;

        if (!wrongId) {
            throw new Error("expected a distractor");
        }

        store.set(respondAtom, {question, targetId: wrongId});
        const feedback = await store.set(submitAnswerAtom, question);

        expect(feedback.correct).toBe(false);

        const queue = await store.get(reviewQueueAtom);
        expect(queue[question.id]).toMatchObject({
            repetitions: 0,
            intervalDays: 1,
        });
    });

    it("promotes difficulty after a run of correct answers", async () => {
        const store = createStore();

        await store.set(initializeQuizAtom, {length: 6});
        await flush();

        expect(store.get(adaptiveDifficultyAtom)).toBe(0);

        for (const id of store.get(quizAtom).slice(0, 4)) {
            const question = getAssessmentQuestion(id);

            if (!question) {
                continue;
            }

            for (const correctId of getCorrectIds(question)) {
                store.set(respondAtom, {question, targetId: correctId});
            }

            await store.set(submitAnswerAtom, question);
        }

        expect(store.get(adaptiveDifficultyAtom)).toBe(1);
    });

    it("keeps serving questions instead of ending the session", async () => {
        const store = createStore();

        await store.set(initializeQuizAtom, {length: 10});
        await flush();

        const initialLength = store.get(quizAtom).length;

        for (let index = 0; index < 9; index += 1) {
            await store.set(goToNextQuestionAtom);
        }

        expect(store.get(currentQuestionIndexAtom)).toBe(9);
        expect(store.get(quizAtom).length).toBeGreaterThan(initialLength);
        expect(
            store.get(quizAtom)[store.get(currentQuestionIndexAtom)]
        ).toBeDefined();
    });

    it("never repeats a question when the queue refills", async () => {
        const store = createStore();

        await store.set(initializeQuizAtom, {length: 10});
        await flush();

        for (let index = 0; index < 25; index += 1) {
            await store.set(goToNextQuestionAtom);
        }

        const ids = store.get(quizAtom);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("shows the checkpoint only after the digest has been read", async () => {
        const store = createStore();

        await store.set(initializeQuizAtom, {length: 15});
        await flush();

        for (let index = 0; index < 10; index += 1) {
            const id = store.get(quizAtom)[index];
            const question = getAssessmentQuestion(id);

            if (!question) {
                continue;
            }

            for (const correctId of getCorrectIds(question)) {
                store.set(respondAtom, {question, targetId: correctId});
            }

            await store.set(submitAnswerAtom, question);

            if (index < 9) {
                await store.set(goToNextQuestionAtom);
            }
        }

        expect(store.get(checkpointAtom)).toBeNull();
        expect(store.get(lastFeedbackAtom)).not.toBeNull();

        await store.set(goToNextQuestionAtom);

        expect(store.get(checkpointAtom)).toMatchObject({
            answered: 10,
            correct: 10,
        });
        expect(store.get(currentQuestionIndexAtom)).toBe(9);
        expect(store.get(quizStatusAtom)).toBe("ready");
    });

    it("resumes the run after the checkpoint is dismissed", async () => {
        const store = createStore();

        await store.set(initializeQuizAtom, {length: 15});
        await flush();

        for (let index = 0; index < 10; index += 1) {
            const question = getAssessmentQuestion(store.get(quizAtom)[index]);

            if (!question) {
                continue;
            }

            store.set(respondAtom, {
                question,
                targetId: getCorrectIds(question)[0],
            });
            await store.set(submitAnswerAtom, question);

            if (index < 9) {
                await store.set(goToNextQuestionAtom);
            }
        }

        await store.set(goToNextQuestionAtom);
        store.set(dismissCheckpointAtom);
        await store.set(goToNextQuestionAtom);

        expect(store.get(checkpointAtom)).toBeNull();
        expect(store.get(currentQuestionIndexAtom)).toBe(10);
    });
});
