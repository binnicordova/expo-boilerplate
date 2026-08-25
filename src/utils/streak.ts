import {DAILY_GOAL_CORRECT} from "@/constants/certification";
import type {StreakState} from "@/models/progression";
import {daysBetween, toDayKey} from "@/utils/date";

export const INITIAL_STREAK: StreakState = {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDay: null,
    daysCertified: 0,
    todayAnswered: 0,
    todayCorrect: 0,
    goalMetDays: 0,
    lastGoalDay: null,
};

export const registerActivity = (
    state: StreakState,
    reference: Date = new Date()
): StreakState => {
    const today = toDayKey(reference);

    if (state.lastActiveDay === today) {
        return state;
    }

    const gap = state.lastActiveDay
        ? daysBetween(state.lastActiveDay, today)
        : null;

    const currentStreak = gap === 1 ? state.currentStreak + 1 : 1;

    return {
        ...state,
        currentStreak,
        longestStreak: Math.max(state.longestStreak, currentStreak),
        lastActiveDay: today,
        daysCertified: state.daysCertified + 1,
        todayAnswered: 0,
        todayCorrect: 0,
    };
};

export const recordAnswer = (
    state: StreakState,
    correct: boolean,
    reference: Date = new Date()
): StreakState => {
    const today = toDayKey(reference);
    const active = registerActivity(state, reference);

    const todayAnswered = active.todayAnswered + 1;
    const todayCorrect = active.todayCorrect + (correct ? 1 : 0);
    const reachedGoal =
        todayCorrect >= DAILY_GOAL_CORRECT && active.lastGoalDay !== today;

    return {
        ...active,
        todayAnswered,
        todayCorrect,
        goalMetDays: reachedGoal ? active.goalMetDays + 1 : active.goalMetDays,
        lastGoalDay: reachedGoal ? today : active.lastGoalDay,
    };
};

export const getActiveStreak = (
    state: StreakState,
    reference: Date = new Date()
): number => {
    if (!state.lastActiveDay) {
        return 0;
    }

    const gap = daysBetween(state.lastActiveDay, toDayKey(reference));
    return gap <= 1 ? state.currentStreak : 0;
};

export const isStreakAtRisk = (
    state: StreakState,
    reference: Date = new Date()
): boolean =>
    Boolean(state.lastActiveDay) &&
    state.lastActiveDay !== toDayKey(reference) &&
    getActiveStreak(state, reference) > 0;

export const getDailyGoal = (
    state: StreakState,
    reference: Date = new Date()
) => {
    const isToday = state.lastActiveDay === toDayKey(reference);
    const correct = isToday ? state.todayCorrect : 0;

    return {
        correct,
        target: DAILY_GOAL_CORRECT,
        progress: Math.min(1, correct / DAILY_GOAL_CORRECT),
        met: correct >= DAILY_GOAL_CORRECT,
    };
};
