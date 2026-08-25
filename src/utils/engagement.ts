import {DOMAIN_LABEL} from "@/constants/assessment";
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
} from "@/constants/notifications";
import {PATHS} from "@/constants/routes";
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
            title: `${activeStreak}-day streak on the line`,
            body: `One correct answer keeps it alive. You are level ${level}.`,
            path: String(PATHS.HOME),
        });
    }

    if (cooldown.availableAt && !cooldown.blocked) {
        candidates.push({
            id: `exam-retry-${cooldown.availableAt}`,
            trigger: "exam-retry",
            priority: 95,
            title: "Your retake is unlocked",
            body: "The cooldown is over. Take the certification exam again.",
            path: String(PATHS.EXAM),
        });
    }

    if (readiness.eligible && !certification) {
        candidates.push({
            id: `exam-unlocked-${today}`,
            trigger: "exam-unlocked",
            priority: 90,
            title: "Certification exam unlocked",
            body: `You cleared every requirement. ${ELIGIBILITY.answered}+ questions of practice say you are ready.`,
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
                title: `Certification expires in ${daysLeft} days`,
                body: "Re-certify to keep your credential valid.",
                path: String(PATHS.EXAM),
            });
        }
    }

    if (snapshot.dueReviews > 0) {
        candidates.push({
            id: `reviews-due-${today}`,
            trigger: "reviews-due",
            priority: 70,
            title: `${snapshot.dueReviews} question${snapshot.dueReviews === 1 ? "" : "s"} due for review`,
            body: "These are the ones you missed. Now is when they stick.",
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
                title: `${remaining} from your daily goal`,
                body: "You are almost there. Finish the set.",
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
            title: `${nextNode.label} is nearly unlocked`,
            body: `You are ${Math.round((1 - nextNode.progress) * 100)}% away from mastering it.`,
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
                    milestone >= 21
                        ? "Your progress is still here"
                        : `${milestone} days since your last session`,
                body: weakest
                    ? `Pick up where you left off — ${DOMAIN_LABEL[weakest.domain]} is your weakest domain.`
                    : "Five questions is all it takes to restart the habit.",
                path: String(PATHS.HOME),
            });
        }
    }

    return candidates;
};

const FALLBACKS: Record<LearnerTier, {title: string; body: string}[]> = {
    newcomer: [
        {
            title: "Two questions, two minutes",
            body: "The fastest way to find out what you already know.",
        },
        {
            title: "Build the habit early",
            body: "A short daily set beats one long session a week.",
        },
        {
            title: "Pick up where you left off",
            body: "Every answer teaches you why, not just what.",
        },
    ],
    learner: [
        {
            title: "Keep your mastery climbing",
            body: "A short set now keeps your weakest domain moving.",
        },
        {
            title: "Level up your weakest domain",
            body: "The adaptive engine will meet you where you are.",
        },
        {
            title: "Ready for something harder?",
            body: "Clear a few Professional questions to unlock Expert.",
        },
    ],
    candidate: [
        {
            title: "The exam is within reach",
            body: "A focused set today moves you closer to eligibility.",
        },
        {
            title: "Sharpen before you certify",
            body: "Expert questions are what the exam weighs the most.",
        },
        {
            title: "Dress rehearsal",
            body: "Try a timed challenge to practise under pressure.",
        },
    ],
    certified: [
        {
            title: "Keep your edge",
            body: "Certified developers lose ground fastest when they stop.",
        },
        {
            title: "Stay interview ready",
            body: "A few Expert questions keep the hard material fresh.",
        },
        {
            title: "Defend your credential",
            body: "Re-certification is easier when you never stopped.",
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
            title: fallback.title,
            body: fallback.body,
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
