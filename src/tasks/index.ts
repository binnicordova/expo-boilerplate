import * as BackgroundTask from "expo-background-task";
import {STORAGE_ID} from "@/constants/storage";
import {api, type CertificationSyncPayload} from "@/services/api";
import {scheduleLocalNotification} from "@/utils/notification";
import {storage} from "@/utils/storage";

export enum TASKS {
    NOTIFY_PENDING_QUIZ = "notify-pending-quiz",
    SYNC_CERTIFICATIONS = "sync-certifications",
}

export const notifyMatchHits = async () => {
    try {
        const title = "New Quiz Available!";
        const body = "Pasar un Quiz is key for your new interview preparation!";
        await scheduleLocalNotification(title, body, {
            task: TASKS.NOTIFY_PENDING_QUIZ,
        });
        return BackgroundTask.BackgroundTaskResult.Success;
    } catch (error) {
        console.error("Error notifying match hits:", error);
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
