import {ELIGIBILITY} from "@/constants/certification";
import type {AssessmentQuestion} from "@/models/assessment";
import type {ExamAttempt} from "@/models/certification";
import type {ProgressionState} from "@/models/progression";
import {getCooldown, getReadiness, gradeExam} from "./certification";
import {INITIAL_PROGRESSION} from "./progression";

const digest = {headline: "h", body: "b"};

const question = (
    id: string,
    domain: AssessmentQuestion["domain"],
    difficulty: AssessmentQuestion["difficulty"]
): AssessmentQuestion => ({
    id,
    topicId: id,
    domain,
    difficulty,
    format: "multiple-choice",
    prompt: id,
    digest,
    alternatives: [
        {id: `${id}-ok`, text: "right", is_correct: true},
        {id: `${id}-no`, text: "wrong", is_correct: false},
    ],
});

const answer = (id: string, correct: boolean) => ({
    [id]: {
        kind: "selection" as const,
        selectedIds: [correct ? `${id}-ok` : `${id}-no`],
    },
});

const readyProgression = (): ProgressionState => ({
    ...INITIAL_PROGRESSION,
    answered: ELIGIBILITY.answered,
    answeredByDifficulty: {2: ELIGIBILITY.expertAnswered},
    masteryByDomain: {
        react: {
            domain: "react",
            answered: 20,
            correct: 18,
            score: 0.9,
            difficultyReached: 2,
        },
        typescript: {
            domain: "typescript",
            answered: 20,
            correct: 15,
            score: 0.75,
            difficultyReached: 2,
        },
        node: {
            domain: "node",
            answered: 20,
            correct: 14,
            score: 0.7,
            difficultyReached: 1,
        },
    },
});

describe("getReadiness", () => {
    it("blocks a brand new user", () => {
        const readiness = getReadiness(INITIAL_PROGRESSION, 0);

        expect(readiness.eligible).toBe(false);
        expect(readiness.progress).toBe(0);
        expect(readiness.requirements.every((entry) => !entry.met)).toBe(true);
    });

    it("unlocks only when every requirement is met", () => {
        const progression = readyProgression();

        expect(getReadiness(progression, ELIGIBILITY.streakDays).eligible).toBe(
            true
        );
        expect(
            getReadiness(progression, ELIGIBILITY.streakDays - 1).eligible
        ).toBe(false);
    });

    it("does not unlock on volume alone", () => {
        const readiness = getReadiness(
            {
                ...INITIAL_PROGRESSION,
                answered: 500,
                answeredByDifficulty: {0: 500},
            },
            30
        );

        expect(readiness.eligible).toBe(false);
        expect(
            readiness.requirements.find((entry) => entry.id === "expert")?.met
        ).toBe(false);
    });

    it("reports partial progress toward eligibility", () => {
        const readiness = getReadiness(
            {...INITIAL_PROGRESSION, answered: ELIGIBILITY.answered / 2},
            0
        );

        expect(readiness.progress).toBeGreaterThan(0);
        expect(readiness.progress).toBeLessThan(1);
    });
});

describe("gradeExam", () => {
    const questions = [
        ...Array.from({length: 5}, (_, index) =>
            question(`f${index}`, "react", 0)
        ),
        ...Array.from({length: 12}, (_, index) =>
            question(`p${index}`, "typescript", 1)
        ),
        ...Array.from({length: 8}, (_, index) =>
            question(`e${index}`, "node", 2)
        ),
    ];

    const respondAll = (predicate: (id: string) => boolean) =>
        Object.assign(
            {},
            ...questions.map((entry) => answer(entry.id, predicate(entry.id)))
        );

    it("passes a strong, balanced performance", () => {
        const grade = gradeExam(
            questions,
            respondAll(() => true)
        );

        expect(grade.passed).toBe(true);
        expect(grade.percentage).toBe(100);
        expect(grade.failureReasons).toHaveLength(0);
    });

    it("fails below the overall pass mark", () => {
        let answered = 0;

        const grade = gradeExam(
            questions,
            respondAll(() => {
                answered += 1;
                return answered % 2 === 0;
            })
        );

        expect(grade.passed).toBe(false);
        expect(grade.failureReasons[0]).toContain("below the 80% pass mark");
    });

    it("fails a candidate who is strong overall but weak on expert questions", () => {
        const grade = gradeExam(
            questions,
            respondAll((id) => !id.startsWith("e"))
        );

        expect(grade.percentage).toBeGreaterThanOrEqual(60);
        expect(grade.passed).toBe(false);
        expect(
            grade.failureReasons.some((reason) =>
                reason.includes("Expert section")
            )
        ).toBe(true);
    });

    it("fails a candidate who bombs a single domain", () => {
        const grade = gradeExam(
            questions,
            respondAll((id) => !id.startsWith("f"))
        );

        expect(grade.passed).toBe(false);
        expect(
            grade.failureReasons.some((reason) => reason.includes("react"))
        ).toBe(true);
        expect(grade.weakestDomain?.domain).toBe("react");
    });

    it("treats unanswered questions as incorrect", () => {
        const grade = gradeExam(questions, {});

        expect(grade.score).toBe(0);
        expect(grade.passed).toBe(false);
    });

    it("breaks the result down by domain and difficulty", () => {
        const grade = gradeExam(
            questions,
            respondAll(() => true)
        );

        expect(grade.byDifficulty.map((entry) => entry.answered)).toEqual([
            5, 12, 8,
        ]);
        expect(grade.byDomain).toHaveLength(3);
    });
});

const attempt = (passed: boolean, submittedAt: string): ExamAttempt =>
    ({
        attemptId: submittedAt,
        userId: "user",
        passed,
        submittedAt,
        startedAt: submittedAt,
        durationSeconds: 100,
        timedOut: false,
        score: 0,
        total: 25,
        percentage: 0,
        expertScore: 0,
        weakestDomain: null,
        failureReasons: [],
        byDomain: [],
        byDifficulty: [],
    }) as ExamAttempt;

describe("getCooldown", () => {
    const now = new Date("2026-04-01T12:00:00Z");

    it("allows a first attempt", () => {
        expect(getCooldown([], now).blocked).toBe(false);
    });

    it("blocks for 24 hours after one failure", () => {
        const state = getCooldown(
            [attempt(false, "2026-04-01T06:00:00Z")],
            now
        );

        expect(state.blocked).toBe(true);
        expect(state.remainingMs).toBe(18 * 3_600_000);
    });

    it("escalates the cooldown after repeated failures", () => {
        const state = getCooldown(
            [
                attempt(false, "2026-03-30T12:00:00Z"),
                attempt(false, "2026-04-01T06:00:00Z"),
            ],
            now
        );

        expect(state.blocked).toBe(true);
        expect(state.remainingMs).toBeGreaterThan(24 * 3_600_000);
    });

    it("clears once the window has elapsed", () => {
        expect(
            getCooldown([attempt(false, "2026-03-28T06:00:00Z")], now).blocked
        ).toBe(false);
    });

    it("resets the escalation after a pass", () => {
        const state = getCooldown(
            [
                attempt(false, "2026-03-20T12:00:00Z"),
                attempt(false, "2026-03-21T12:00:00Z"),
                attempt(true, "2026-03-22T12:00:00Z"),
                attempt(false, "2026-04-01T06:00:00Z"),
            ],
            now
        );

        expect(state.remainingMs).toBe(18 * 3_600_000);
    });
});
