import {DAILY_GOAL_CORRECT, ELIGIBILITY} from "@/constants/certification";
import {
    CERTIFICATION_RENEWAL_DAYS,
    DAILY_GOAL_NUDGE_REMAINING,
    DAILY_SLOT_HOURS,
    MAX_SCHEDULED,
    PLAN_HORIZON_DAYS,
    QUIET_HOURS,
    SKILL_UNLOCK_PROGRESS,
    WIN_BACK_DAYS,
    WIN_BACK_LAPSED_DAYS,
} from "@/constants/notifications";
import {PATHS} from "@/constants/routes";
import type {TranslationKey} from "@/i18n/types";
import type {CooldownState, Readiness} from "@/models/certification";
import type {
    LearnerTier,
    NotificationDelivery,
    PlannedNotification,
} from "@/models/notification";
import type {
    ProgressionState,
    SkillNodeView,
    StreakState,
} from "@/models/progression";
import type {CertificationRecord} from "@/stores/user";
import {daysBetween, toDayKey} from "@/utils/date";
import {getActiveStreak} from "@/utils/streak";

export const INITIAL_DELIVERY: NotificationDelivery = {
    sent: 0,
    opened: 0,
    consecutiveIgnored: 0,
    lastSentAt: null,
    sentDayKeys: [],
    lastTriggerId: null,
};

export type EngagementSnapshot = {
    progression: ProgressionState;
    streak: StreakState;
    dueReviews: number;
    readiness: Readiness;
    cooldown: CooldownState;
    certification: CertificationRecord | null;
    skillTree: SkillNodeView[];
    delivery: NotificationDelivery;
    preferredHour: number;
};

export const getLearnerTier = (
    progression: ProgressionState,
    readiness: Readiness,
    certification: CertificationRecord | null,
    now: Date = new Date()
): LearnerTier => {
    if (
        certification &&
        new Date(certification.validUntil).getTime() > now.getTime()
    ) {
        return "certified";
    }

    if (readiness.eligible || readiness.progress >= 0.75) {
        return "candidate";
    }

    return (progression.answered ?? 0) < 20 ? "newcomer" : "learner";
};

const atHour = (reference: Date, hour: number, dayOffset = 0): Date => {
    const date = new Date(reference);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, 0, 0, 0);
    return date;
};

export const isQuietHour = (hour: number): boolean =>
    hour >= QUIET_HOURS.start || hour < QUIET_HOURS.end;

export const nextAllowedSlot = (candidate: Date): Date => {
    const slot = new Date(candidate);

    if (slot.getHours() >= QUIET_HOURS.start) {
        slot.setDate(slot.getDate() + 1);
        slot.setHours(QUIET_HOURS.end, 0, 0, 0);
        return slot;
    }

    if (slot.getHours() < QUIET_HOURS.end) {
        slot.setHours(QUIET_HOURS.end, 0, 0, 0);
    }

    return slot;
};

const getWeakestDomain = (progression: ProgressionState) => {
    const masteries = Object.values(progression.masteryByDomain);

    if (!masteries.length) {
        return null;
    }

    return masteries.reduce((weakest, entry) =>
        entry.score < weakest.score ? entry : weakest
    );
};

type Candidate = Omit<PlannedNotification, "tier" | "fireAt">;

const buildCandidates = (
    snapshot: EngagementSnapshot,
    now: Date
): Candidate[] => {
    const {progression, streak, readiness, cooldown, certification} = snapshot;
    const today = toDayKey(now);
    const candidates: Candidate[] = [];
    const activeStreak = getActiveStreak(streak, now);
    const level = progression.level ?? 1;

    if (activeStreak > 0 && streak.lastActiveDay !== today) {
        candidates.push({
            id: `streak-save-${today}`,
            trigger: "streak-save",
            priority: 100,
            title: {
                key: "notifications.streakSave.title",
                params: {count: activeStreak},
            },
            body: {
                key: "notifications.streakSave.body",
                params: {level},
            },
            path: String(PATHS.HOME),
        });
    }

    if (cooldown.availableAt && !cooldown.blocked) {
        candidates.push({
            id: `exam-retry-${cooldown.availableAt}`,
            trigger: "exam-retry",
            priority: 95,
            title: {key: "notifications.examRetry.title"},
            body: {key: "notifications.examRetry.body"},
            path: String(PATHS.EXAM),
        });
    }

    if (readiness.eligible && !certification) {
        candidates.push({
            id: `exam-unlocked-${today}`,
            trigger: "exam-unlocked",
            priority: 90,
            title: {key: "notifications.examUnlocked.title"},
            body: {
                key: "notifications.examUnlocked.body",
                params: {answered: ELIGIBILITY.answered},
            },
            path: String(PATHS.EXAM),
        });
    }

    if (certification) {
        const daysLeft = daysBetween(
            today,
            toDayKey(new Date(certification.validUntil))
        );

        if (daysLeft <= CERTIFICATION_RENEWAL_DAYS && daysLeft >= 0) {
            candidates.push({
                id: `certification-expiring-${certification.attemptId}`,
                trigger: "certification-expiring",
                priority: 85,
                title: {
                    key: "notifications.certificationExpiring.title",
                    params: {count: daysLeft},
                },
                body: {key: "notifications.certificationExpiring.body"},
                path: String(PATHS.EXAM),
            });
        }
    }

    if (snapshot.dueReviews > 0) {
        candidates.push({
            id: `reviews-due-${today}`,
            trigger: "reviews-due",
            priority: 70,
            title: {
                key: "notifications.reviewsDue.title",
                params: {count: snapshot.dueReviews},
            },
            body: {key: "notifications.reviewsDue.body"},
            path: String(PATHS.HOME),
        });
    }

    if (streak.lastActiveDay === today) {
        const remaining = DAILY_GOAL_CORRECT - streak.todayCorrect;

        if (remaining > 0 && remaining <= DAILY_GOAL_NUDGE_REMAINING) {
            candidates.push({
                id: `daily-goal-${today}`,
                trigger: "daily-goal",
                priority: 60,
                title: {
                    key: "notifications.dailyGoal.title",
                    params: {count: remaining},
                },
                body: {key: "notifications.dailyGoal.body"},
                path: String(PATHS.HOME),
            });
        }
    }

    const nextNode = snapshot.skillTree.find(
        (node) =>
            node.status === "available" &&
            node.progress >= SKILL_UNLOCK_PROGRESS
    );

    if (nextNode) {
        candidates.push({
            id: `skill-unlock-${nextNode.id}`,
            trigger: "skill-unlock",
            priority: 50,
            title: {
                key: "notifications.skillUnlock.title",
                params: {node: nextNode.id},
            },
            body: {
                key: "notifications.skillUnlock.body",
                params: {
                    percentage: Math.round((1 - nextNode.progress) * 100),
                },
            },
            path: String(PATHS.SKILLS),
        });
    }

    if (streak.lastActiveDay && activeStreak === 0) {
        const lapsed = daysBetween(streak.lastActiveDay, today);
        const milestone = WIN_BACK_DAYS.find((day) => day === lapsed);

        if (milestone) {
            const weakest = getWeakestDomain(progression);

            candidates.push({
                id: `win-back-${streak.lastActiveDay}-${milestone}`,
                trigger: "win-back",
                priority: 40,
                title:
                    milestone >= WIN_BACK_LAPSED_DAYS
                        ? {key: "notifications.winBack.titleLapsed"}
                        : {
                              key: "notifications.winBack.title",
                              params: {count: milestone},
                          },
                body: weakest
                    ? {
                          key: "notifications.winBack.bodyWeakest",
                          params: {domain: weakest.domain},
                      }
                    : {key: "notifications.winBack.body"},
                path: String(PATHS.HOME),
            });
        }
    }

    return candidates;
};

type Fallback = {title: TranslationKey; body: TranslationKey};

const FALLBACKS: Record<LearnerTier, Fallback[]> = {
    newcomer: [
        {
            title: "notifications.fallback.newcomer.quickStart.title",
            body: "notifications.fallback.newcomer.quickStart.body",
        },
        {
            title: "notifications.fallback.newcomer.habit.title",
            body: "notifications.fallback.newcomer.habit.body",
        },
        {
            title: "notifications.fallback.newcomer.resume.title",
            body: "notifications.fallback.newcomer.resume.body",
        },
    ],
    learner: [
        {
            title: "notifications.fallback.learner.mastery.title",
            body: "notifications.fallback.learner.mastery.body",
        },
        {
            title: "notifications.fallback.learner.weakest.title",
            body: "notifications.fallback.learner.weakest.body",
        },
        {
            title: "notifications.fallback.learner.harder.title",
            body: "notifications.fallback.learner.harder.body",
        },
    ],
    candidate: [
        {
            title: "notifications.fallback.candidate.withinReach.title",
            body: "notifications.fallback.candidate.withinReach.body",
        },
        {
            title: "notifications.fallback.candidate.sharpen.title",
            body: "notifications.fallback.candidate.sharpen.body",
        },
        {
            title: "notifications.fallback.candidate.rehearsal.title",
            body: "notifications.fallback.candidate.rehearsal.body",
        },
    ],
    certified: [
        {
            title: "notifications.fallback.certified.edge.title",
            body: "notifications.fallback.certified.edge.body",
        },
        {
            title: "notifications.fallback.certified.interviewReady.title",
            body: "notifications.fallback.certified.interviewReady.body",
        },
        {
            title: "notifications.fallback.certified.defend.title",
            body: "notifications.fallback.certified.defend.body",
        },
    ],
};

const buildSlots = (now: Date, horizonDays: number): Date[] => {
    const slots: Date[] = [];

    for (let day = 0; day < horizonDays; day += 1) {
        for (const hour of DAILY_SLOT_HOURS) {
            const slot = atHour(now, hour, day);

            if (slot.getTime() <= now.getTime() + 60_000) {
                continue;
            }

            slots.push(nextAllowedSlot(slot));
        }
    }

    return slots.sort((a, b) => a.getTime() - b.getTime());
};

export const planNotifications = (
    snapshot: EngagementSnapshot,
    now: Date = new Date()
): PlannedNotification[] => {
    const tier = getLearnerTier(
        snapshot.progression,
        snapshot.readiness,
        snapshot.certification,
        now
    );

    const candidates = buildCandidates(snapshot, now).sort(
        (a, b) => b.priority - a.priority
    );

    const fallbacks = FALLBACKS[tier];
    const slots = buildSlots(now, PLAN_HORIZON_DAYS).slice(0, MAX_SCHEDULED);

    return slots.map((slot, index) => {
        const candidate = candidates[index];

        if (candidate) {
            return {
                ...candidate,
                tier,
                fireAt: slot.toISOString(),
                id: `${candidate.id}-${index}`,
            };
        }

        const fallback = fallbacks[index % fallbacks.length];

        return {
            id: `fallback-${tier}-${index}`,
            trigger: "daily-goal" as const,
            tier,
            priority: 10,
            title: {key: fallback.title},
            body: {key: fallback.body},
            path: String(PATHS.HOME),
            fireAt: slot.toISOString(),
        };
    });
};

export const registerSent = (
    delivery: NotificationDelivery,
    planned: PlannedNotification,
    now: Date = new Date()
): NotificationDelivery => ({
    sent: delivery.sent + 1,
    opened: delivery.opened,
    consecutiveIgnored: delivery.consecutiveIgnored + 1,
    lastSentAt: now.toISOString(),
    sentDayKeys: [...delivery.sentDayKeys, toDayKey(now)].slice(-14),
    lastTriggerId: planned.id,
});

export const registerOpened = (
    delivery: NotificationDelivery
): NotificationDelivery => ({
    ...delivery,
    opened: delivery.opened + 1,
    consecutiveIgnored: 0,
});
