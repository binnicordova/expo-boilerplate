import {createStore} from "jotai";
import {
    EXAM_BLUEPRINT,
    EXAM_LENGTH,
    EXAM_MIN_DOMAINS,
} from "@/constants/certification";
import {buildExam, getAssessmentQuestion} from "@/services/assessment";
import {
    canStartExamAtom,
    cooldownAtom,
    examQuestionIdsAtom,
    examStatusAtom,
    readinessAtom,
    startExamAtom,
    submitExamAtom,
} from "@/stores/certification";
import {progressionAtom} from "@/stores/progression";
import {respondAtom, responseByQuestionAtom} from "@/stores/question";
import {streakAtom} from "@/stores/retention";
import {certificationByUserAtom} from "@/stores/user";
import {toDayKey} from "@/utils/date";
import {getCorrectIds} from "@/utils/grading";
import {INITIAL_PROGRESSION} from "@/utils/progression";
import {INITIAL_STREAK} from "@/utils/streak";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("expo-application", () => ({
    applicationId: "com.expofs.test",
    getAndroidId: () => "android-test-id",
    getIosIdForVendorAsync: async () => "ios-vendor-test-id",
}));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const makeEligible = async (store: ReturnType<typeof createStore>) => {
    store.set(progressionAtom, {
        ...INITIAL_PROGRESSION,
        answered: 200,
        answeredByDifficulty: {0: 60, 1: 90, 2: 50},
        masteryByDomain: {
            react: {
                domain: "react",
                answered: 60,
                correct: 55,
                score: 0.92,
                difficultyReached: 2,
            },
            typescript: {
                domain: "typescript",
                answered: 40,
                correct: 32,
                score: 0.8,
                difficultyReached: 2,
            },
            node: {
                domain: "node",
                answered: 40,
                correct: 30,
                score: 0.75,
                difficultyReached: 2,
            },
        },
    });

    store.set(streakAtom, {
        ...INITIAL_STREAK,
        currentStreak: 10,
        longestStreak: 10,
        lastActiveDay: toDayKey(new Date()),
    });

    await flush();
};

describe("buildExam", () => {
    it("fills the blueprint exactly", () => {
        const ids = buildExam();

        expect(ids).toHaveLength(EXAM_LENGTH);
        expect(new Set(ids).size).toBe(EXAM_LENGTH);

        const counts = new Map<number, number>();

        for (const id of ids) {
            const difficulty = getAssessmentQuestion(id)?.difficulty ?? -1;
            counts.set(difficulty, (counts.get(difficulty) ?? 0) + 1);
        }

        for (const slot of EXAM_BLUEPRINT) {
            expect(counts.get(slot.difficulty)).toBe(slot.count);
        }
    });

    it("spreads across multiple domains", () => {
        const domains = new Set(
            buildExam().map((id) => getAssessmentQuestion(id)?.domain)
        );

        expect(domains.size).toBeGreaterThanOrEqual(EXAM_MIN_DOMAINS);
    });

    it("varies between attempts", () => {
        expect(buildExam()).not.toEqual(buildExam());
    });
});

describe("exam lifecycle", () => {
    it("refuses to start until the candidate is eligible", async () => {
        const store = createStore();
        await flush();

        expect(store.get(readinessAtom).eligible).toBe(false);
        expect(store.get(canStartExamAtom)).toBe(false);
        expect(await store.set(startExamAtom)).toBe(false);
        expect(store.get(examStatusAtom)).toBe("idle");
    });

    it("starts a full length exam once eligible", async () => {
        const store = createStore();
        await makeEligible(store);

        expect(store.get(canStartExamAtom)).toBe(true);
        expect(await store.set(startExamAtom)).toBe(true);
        expect(store.get(examStatusAtom)).toBe("running");
        expect(store.get(examQuestionIdsAtom)).toHaveLength(EXAM_LENGTH);
    });

    it("clears any practice answers for the sampled questions", async () => {
        const store = createStore();
        await makeEligible(store);
        await store.set(startExamAtom);

        const responses = store.get(responseByQuestionAtom);

        for (const id of store.get(examQuestionIdsAtom)) {
            expect(responses[id]).toBeUndefined();
        }
    });

    it("issues a certificate only on a passing attempt", async () => {
        const store = createStore();
        await makeEligible(store);
        await store.set(startExamAtom);

        for (const id of store.get(examQuestionIdsAtom)) {
            const question = getAssessmentQuestion(id);

            if (!question) {
                continue;
            }

            for (const correctId of getCorrectIds(question)) {
                store.set(respondAtom, {question, targetId: correctId});
            }
        }

        const attempt = await store.set(submitExamAtom);

        expect(attempt?.passed).toBe(true);
        expect(attempt?.total).toBe(EXAM_LENGTH);

        const certifications = await store.get(certificationByUserAtom);
        const record = certifications[attempt?.userId ?? ""];

        expect(record).toMatchObject({passed: true, percentage: 100});
        expect(new Date(record.validUntil).getTime()).toBeGreaterThan(
            Date.now()
        );
    });

    it("withholds the certificate and starts a cooldown on failure", async () => {
        const store = createStore();
        await makeEligible(store);
        await store.set(startExamAtom);

        const attempt = await store.set(submitExamAtom);

        expect(attempt?.passed).toBe(false);
        expect(attempt?.failureReasons.length).toBeGreaterThan(0);

        const certifications = await store.get(certificationByUserAtom);
        expect(certifications[attempt?.userId ?? ""]).toBeUndefined();

        await flush();
        expect(store.get(cooldownAtom).blocked).toBe(true);
        expect(store.get(canStartExamAtom)).toBe(false);
    });

    it("ignores a submit when no exam is running", async () => {
        const store = createStore();
        await makeEligible(store);

        expect(await store.set(submitExamAtom)).toBeNull();
    });
});
