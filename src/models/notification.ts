import type {TranslationRef} from "@/i18n/types";

export type Notification = {
    to: string;
    title: string;
    body: string;
    data: {
        url: string;
    };
};

export type EngagementTrigger =
    | "streak-save"
    | "reviews-due"
    | "exam-unlocked"
    | "exam-retry"
    | "certification-expiring"
    | "daily-goal"
    | "skill-unlock"
    | "win-back";

export type LearnerTier = "newcomer" | "learner" | "candidate" | "certified";

export type PlannedNotification = {
    id: string;
    trigger: EngagementTrigger;
    tier: LearnerTier;
    priority: number;
    title: TranslationRef;
    body: TranslationRef;
    path: string;
    fireAt: string;
};

export type NotificationDelivery = {
    sent: number;
    opened: number;
    consecutiveIgnored: number;
    lastSentAt: string | null;
    sentDayKeys: string[];
    lastTriggerId: string | null;
};

export type NotificationPreferences = {
    enabled: boolean;
    preferredHour: number;
};
