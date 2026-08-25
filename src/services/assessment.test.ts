import {getNextDifficulty} from "@/utils/adaptive";
import {buildSession, getAssessmentQuestion, INDEX} from "./assessment";

describe("assessment catalog", () => {
    it("indexes both the imported bank and the authored questions", () => {
        expect(INDEX.length).toBeGreaterThan(400);
        expect(new Set(INDEX.map((entry) => entry.id)).size).toBe(INDEX.length);
    });

    it("covers every supported format", () => {
        const formats = new Set(
            INDEX.map((entry) => getAssessmentQuestion(entry.id)?.format)
        );

        expect(formats).toContain("multiple-choice");
        expect(formats).toContain("multiple-select");
        expect(formats).toContain("code-analysis");
        expect(formats).toContain("architecture-tradeoff");
        expect(formats).toContain("ordering");
    });

    it("attaches a micro-learning digest to every question", () => {
        for (const entry of INDEX) {
            const question = getAssessmentQuestion(entry.id);

            expect(question?.digest.headline).toBeTruthy();
            expect(question?.digest.body).toBeTruthy();
        }
    });

    it("returns null for an unknown id", () => {
        expect(getAssessmentQuestion("does-not-exist")).toBeNull();
    });
});

describe("buildSession", () => {
    it("returns the requested number of unique questions", () => {
        const session = buildSession({length: 8});

        expect(session).toHaveLength(8);
        expect(new Set(session).size).toBe(8);
    });

    it("front-loads due review questions", () => {
        const reviewIds = [INDEX[3].id, INDEX[7].id];
        const session = buildSession({length: 5, reviewIds});

        expect(session.slice(0, 2)).toEqual(reviewIds);
    });

    it("ignores review ids that are not in the catalog", () => {
        const session = buildSession({length: 3, reviewIds: ["ghost"]});

        expect(session).not.toContain("ghost");
        expect(session).toHaveLength(3);
    });

    it("honours the domain filter", () => {
        const session = buildSession({length: 4, domain: "typescript"});

        for (const id of session) {
            expect(getAssessmentQuestion(id)?.domain).toBe("typescript");
        }
    });

    it("prefers questions at the requested difficulty", () => {
        const session = buildSession({length: 5, difficulty: 2});
        const difficulties = session.map(
            (id) => getAssessmentQuestion(id)?.difficulty
        );

        expect(difficulties.every((value) => value === 2)).toBe(true);
    });

    it("never repeats an excluded question", () => {
        const first = buildSession({length: 5});
        const second = buildSession({length: 5, excludeIds: first});

        expect(second.some((id) => first.includes(id))).toBe(false);
    });
});

describe("getNextDifficulty", () => {
    it("holds steady until the window is full", () => {
        expect(getNextDifficulty(0, [true, true])).toBe(0);
    });

    it("promotes after a strong window", () => {
        expect(getNextDifficulty(0, [true, true, true, true])).toBe(1);
    });

    it("demotes after a weak window", () => {
        expect(getNextDifficulty(2, [false, false, false, true])).toBe(1);
    });

    it("stays inside the difficulty bounds", () => {
        expect(getNextDifficulty(2, [true, true, true, true])).toBe(2);
        expect(getNextDifficulty(0, [false, false, false, false])).toBe(0);
    });
});
