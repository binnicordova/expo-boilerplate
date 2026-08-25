import {
    applyOutcome,
    getLevel,
    getStreakMultiplier,
    getXpAward,
    INITIAL_PROGRESSION,
} from "./progression";
import {resolveSkillTree} from "./skillTree";

describe("getXpAward", () => {
    it("scales with difficulty and accuracy", () => {
        expect(getXpAward({difficulty: 0, accuracy: 1, streak: 0})).toBe(10);
        expect(getXpAward({difficulty: 2, accuracy: 1, streak: 0})).toBe(35);
        expect(getXpAward({difficulty: 2, accuracy: 0, streak: 0})).toBe(0);
    });

    it("applies the streak multiplier and caps it", () => {
        expect(getXpAward({difficulty: 0, accuracy: 1, streak: 10})).toBe(15);
        expect(getStreakMultiplier(1000)).toBe(2);
    });
});

describe("getLevel", () => {
    it("starts at one and advances every 250 xp", () => {
        expect(getLevel(0)).toBe(1);
        expect(getLevel(249)).toBe(1);
        expect(getLevel(250)).toBe(2);
        expect(getLevel(500)).toBe(3);
    });
});

describe("applyOutcome", () => {
    it("tracks mastery per domain", () => {
        let state = INITIAL_PROGRESSION;

        state = applyOutcome(state, {
            domain: "react",
            difficulty: 1,
            correct: true,
            accuracy: 1,
            streak: 0,
        });

        state = applyOutcome(state, {
            domain: "react",
            difficulty: 1,
            correct: false,
            accuracy: 0,
            streak: 0,
        });

        expect(state.masteryByDomain.react).toMatchObject({
            answered: 2,
            correct: 1,
            score: 0.5,
        });
        expect(state.xp).toBe(20);
    });

    it("awards a badge once the sample and score thresholds are met", () => {
        let state = INITIAL_PROGRESSION;

        for (let index = 0; index < 5; index += 1) {
            state = applyOutcome(state, {
                domain: "typescript",
                difficulty: 2,
                correct: true,
                accuracy: 1,
                streak: 0,
            });
        }

        expect(state.badges).toHaveLength(1);
        expect(state.badges[0]).toMatchObject({
            domain: "typescript",
            tier: "gold",
        });
    });

    it("does not award a badge below the minimum sample", () => {
        const state = applyOutcome(INITIAL_PROGRESSION, {
            domain: "node",
            difficulty: 0,
            correct: true,
            accuracy: 1,
            streak: 0,
        });

        expect(state.badges).toHaveLength(0);
    });
});

describe("resolveSkillTree", () => {
    it("locks every node behind an unmet dependency", () => {
        const views = resolveSkillTree(INITIAL_PROGRESSION);
        const root = views.find((view) => view.id === "react-fundamentals");
        const deep = views.find((view) => view.id === "native-modules");

        expect(root?.status).toBe("available");
        expect(deep?.status).toBe("locked");
    });

    it("unlocks descendants once the parent domain is mastered", () => {
        let state = INITIAL_PROGRESSION;

        for (let index = 0; index < 10; index += 1) {
            state = applyOutcome(state, {
                domain: "react",
                difficulty: 1,
                correct: true,
                accuracy: 1,
                streak: 0,
            });
        }

        const views = resolveSkillTree(state);

        expect(
            views.find((view) => view.id === "react-fundamentals")?.status
        ).toBe("mastered");
        expect(views.find((view) => view.id === "react-hooks")?.status).toBe(
            "mastered"
        );
        expect(
            views.find((view) => view.id === "typescript-generics")?.status
        ).toBe("available");
    });
});
