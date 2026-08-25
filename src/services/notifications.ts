import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import {isTV} from "@/constants/platform";
import {STORAGE_ID} from "@/constants/storage";
import type {PlannedNotification} from "@/models/notification";
import {
    cancelEngagementNotifications,
    scheduleNotificationAt,
} from "@/utils/notification";
import {storage} from "@/utils/storage";

export const hasNotificationPermission = async (): Promise<boolean> => {
    if (isTV) {
        return false;
    }

    const {status} = await Notifications.getPermissionsAsync();
    return status === Notifications.PermissionStatus.GRANTED;
};

const registerPushToken = async () => {
    try {
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;

        if (!projectId) {
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync({projectId}))
            .data;

        await storage.setItem(STORAGE_ID.notificationToken, token);
    } catch (error) {
        console.warn("Could not register push token:", error);
    }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
    if (isTV) {
        return false;
    }

    const {status: existingStatus} = await Notifications.getPermissionsAsync();

    if (existingStatus === Notifications.PermissionStatus.GRANTED) {
        await registerPushToken();
        return true;
    }

    const {status} = await Notifications.requestPermissionsAsync();

    if (status !== Notifications.PermissionStatus.GRANTED) {
        return false;
    }

    await registerPushToken();
    return true;
};

export const syncScheduledNotifications = async (
    planned: PlannedNotification[]
): Promise<number> => {
    if (isTV || !(await hasNotificationPermission())) {
        return 0;
    }

    await cancelEngagementNotifications();

    const now = Date.now();
    let scheduled = 0;

    for (const entry of planned) {
        const fireAt = new Date(entry.fireAt);

        if (fireAt.getTime() <= now) {
            continue;
        }

        await scheduleNotificationAt({
            title: entry.title,
            body: entry.body,
            fireAt,
            data: {
                path: entry.path,
                trigger: entry.trigger,
                tier: entry.tier,
                id: entry.id,
            },
        });

        scheduled += 1;
    }

    return scheduled;
};
