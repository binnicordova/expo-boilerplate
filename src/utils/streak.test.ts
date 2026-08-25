import {DAILY_GOAL_CORRECT} from "@/constants/certification";
import {
    getActiveStreak,
    getDailyGoal,
    INITIAL_STREAK,
    isStreakAtRisk,
    recordAnswer,
    registerActivity,
} from "./streak";

const at = (iso: string) => new Date(`${iso}T10:00:00`);

describe("registerActivity", () => {
    it("starts a streak on the first activity", () => {
        const state = registerActivity(INITIAL_STREAK, at("2026-03-01"));

        expect(state.currentStreak).toBe(1);
        expect(state.longestStreak).toBe(1);
        expect(state.lastActiveDay).toBe("2026-03-01");
    });

    it("is idempotent within the same day", () => {
        const first = registerActivity(INITIAL_STREAK, at("2026-03-01"));
        const second = registerActivity(first, at("2026-03-01"));

        expect(second).toBe(first);
        expect(second.daysCertified).toBe(1);
    });

    it("increments on consecutive days", () => {
        const day1 = registerActivity(INITIAL_STREAK, at("2026-03-01"));
        const day2 = registerActivity(day1, at("2026-03-02"));
        const day3 = registerActivity(day2, at("2026-03-03"));

        expect(day3.currentStreak).toBe(3);
        expect(day3.daysCertified).toBe(3);
    });

    it("resets after a missed day but keeps the record", () => {
        const day1 = registerActivity(INITIAL_STREAK, at("2026-03-01"));
        const day2 = registerActivity(day1, at("2026-03-02"));
        const lapsed = registerActivity(day2, at("2026-03-05"));

        expect(lapsed.currentStreak).toBe(1);
        expect(lapsed.longestStreak).toBe(2);
    });

    it("spans month boundaries", () => {
        const last = registerActivity(INITIAL_STREAK, at("2026-03-31"));
        const next = registerActivity(last, at("2026-04-01"));

        expect(next.currentStreak).toBe(2);
    });
});

describe("getActiveStreak", () => {
    it("keeps the streak alive on the following day", () => {
        const state = registerActivity(INITIAL_STREAK, at("2026-03-01"));

        expect(getActiveStreak(state, at("2026-03-02"))).toBe(1);
    });

    it("reports zero once a day has been missed", () => {
        const state = registerActivity(INITIAL_STREAK, at("2026-03-01"));

        expect(getActiveStreak(state, at("2026-03-03"))).toBe(0);
    });
});

describe("isStreakAtRisk", () => {
    it("flags a streak that has not been extended today", () => {
        const state = registerActivity(INITIAL_STREAK, at("2026-03-01"));

        expect(isStreakAtRisk(state, at("2026-03-02"))).toBe(true);
        expect(isStreakAtRisk(state, at("2026-03-01"))).toBe(false);
    });
});

describe("recordAnswer", () => {
    it("counts correct answers toward the daily goal", () => {
        let state = INITIAL_STREAK;

        state = recordAnswer(state, true, at("2026-03-01"));
        state = recordAnswer(state, false, at("2026-03-01"));

        expect(state.todayAnswered).toBe(2);
        expect(state.todayCorrect).toBe(1);
        expect(getDailyGoal(state, at("2026-03-01")).met).toBe(false);
    });

    it("marks the goal met exactly once per day", () => {
        let state = INITIAL_STREAK;

        for (let index = 0; index < DAILY_GOAL_CORRECT + 3; index += 1) {
            state = recordAnswer(state, true, at("2026-03-01"));
        }

        expect(getDailyGoal(state, at("2026-03-01")).met).toBe(true);
        expect(state.goalMetDays).toBe(1);
    });

    it("resets the daily counters on a new day", () => {
        let state = INITIAL_STREAK;

        state = recordAnswer(state, true, at("2026-03-01"));
        state = recordAnswer(state, true, at("2026-03-02"));

        expect(state.todayAnswered).toBe(1);
        expect(state.currentStreak).toBe(2);
        expect(getDailyGoal(state, at("2026-03-02")).correct).toBe(1);
    });

    it("reports no progress for a stale day", () => {
        const state = recordAnswer(INITIAL_STREAK, true, at("2026-03-01"));

        expect(getDailyGoal(state, at("2026-03-05")).correct).toBe(0);
    });
});
