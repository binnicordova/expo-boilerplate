import * as BackgroundTask from "expo-background-task";
import {DEFAULT_PRACTICE_HOUR} from "@/constants/notifications";
import {STORAGE_ID} from "@/constants/storage";
import type {ExamAttempt} from "@/models/certification";
import type {
    NotificationDelivery,
    NotificationPreferences,
} from "@/models/notification";
import type {
    ProgressionState,
    ReviewCard,
    StreakState,
} from "@/models/progression";
import {api, type CertificationSyncPayload} from "@/services/api";
import {syncScheduledNotifications} from "@/services/notifications";
import type {CertificationRecord} from "@/stores/user";
import {getCooldown, getReadiness} from "@/utils/certification";
import {
    INITIAL_DELIVERY,
    planNotifications,
    registerSent,
} from "@/utils/engagement";
import {INITIAL_PROGRESSION} from "@/utils/progression";
import {getDueCards} from "@/utils/scheduler";
import {resolveSkillTree} from "@/utils/skillTree";
import {storage} from "@/utils/storage";
import {getActiveStreak, INITIAL_STREAK} from "@/utils/streak";

export enum TASKS {
    PLAN_NOTIFICATIONS = "plan-notifications",
    SYNC_CERTIFICATIONS = "sync-certifications",
}

export const planEngagementNotifications = async () => {
    try {
        const preferences = await storage.getItem<NotificationPreferences>(
            STORAGE_ID.notificationPreferences,
            {enabled: true, preferredHour: DEFAULT_PRACTICE_HOUR}
        );

        if (!preferences.enabled) {
            return BackgroundTask.BackgroundTaskResult.Success;
        }

        const [
            progression,
            streak,
            reviewQueue,
            attempts,
            delivery,
            certifications,
            user,
        ] = await Promise.all([
            storage.getItem<ProgressionState>(
                STORAGE_ID.progression,
                INITIAL_PROGRESSION
            ),
            storage.getItem<StreakState>(STORAGE_ID.streak, INITIAL_STREAK),
            storage.getItem<Record<string, ReviewCard>>(
                STORAGE_ID.reviewQueue,
                {}
            ),
            storage.getItem<ExamAttempt[]>(STORAGE_ID.examAttempts, []),
            storage.getItem<NotificationDelivery>(
                STORAGE_ID.notificationDelivery,
                INITIAL_DELIVERY
            ),
            storage.getItem<Record<string, CertificationRecord>>(
                STORAGE_ID.certifications,
                {}
            ),
            storage.getItem<{id: string}>(STORAGE_ID.user, {id: ""}),
        ]);

        const planned = planNotifications({
            progression,
            streak,
            dueReviews: getDueCards(reviewQueue).length,
            readiness: getReadiness(progression, getActiveStreak(streak)),
            cooldown: getCooldown(attempts),
            certification: certifications[user.id] ?? null,
            skillTree: resolveSkillTree(progression),
            delivery,
            preferredHour: preferences.preferredHour,
        });

        const scheduled = await syncScheduledNotifications(planned);

        if (scheduled > 0 && planned.length) {
            await storage.setItem(
                STORAGE_ID.notificationDelivery,
                registerSent(delivery, planned[0])
            );
        }

        return BackgroundTask.BackgroundTaskResult.Success;
    } catch (error) {
        console.error("Error planning notifications:", error);
        return BackgroundTask.BackgroundTaskResult.Failed;
    }
};

export const syncCertifications = async () => {
    try {
        const certificationByUser = await storage.getItem<
            Record<string, CertificationSyncPayload>
        >(STORAGE_ID.certifications, {});

        const certifications = Object.values(certificationByUser);
        if (!certifications.length) {
            return BackgroundTask.BackgroundTaskResult.Success;
        }

        let failedCount = 0;

        for (const certification of certifications) {
            try {
                await api.persistCertification(certification);
            } catch (error) {
                failedCount += 1;
                console.error("Error syncing certification:", error);
            }
        }

        return failedCount > 0
            ? BackgroundTask.BackgroundTaskResult.Failed
            : BackgroundTask.BackgroundTaskResult.Success;
    } catch (error) {
        console.error("Error loading certifications for sync:", error);
        return BackgroundTask.BackgroundTaskResult.Failed;
    }
};
