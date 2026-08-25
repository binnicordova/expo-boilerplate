import {atom} from "jotai";
import {atomWithStorage, unwrap} from "jotai/utils";
import {DEFAULT_PRACTICE_HOUR} from "@/constants/notifications";
import {STORAGE_ID} from "@/constants/storage";
import type {
    NotificationDelivery,
    NotificationPreferences,
} from "@/models/notification";
import {
    hasNotificationPermission,
    requestNotificationPermission,
    syncScheduledNotifications,
} from "@/services/notifications";
import {cooldownAtom, readinessAtom} from "@/stores/certification";
import {progressionValueAtom, skillTreeAtom} from "@/stores/progression";
import {dueReviewsAtom, streakValueAtom} from "@/stores/retention";
import {certificationByUserAtom, userAtom} from "@/stores/user";
import {
    INITIAL_DELIVERY,
    isQuietHour,
    planNotifications,
    registerOpened,
    registerSent,
} from "@/utils/engagement";
import {storage} from "@/utils/storage";

const INITIAL_PREFERENCES: NotificationPreferences = {
    enabled: true,
    preferredHour: DEFAULT_PRACTICE_HOUR,
};

export const notificationPreferencesAtom =
    atomWithStorage<NotificationPreferences>(
        STORAGE_ID.notificationPreferences,
        INITIAL_PREFERENCES,
        storage
    );

export const notificationDeliveryAtom = atomWithStorage<NotificationDelivery>(
    STORAGE_ID.notificationDelivery,
    INITIAL_DELIVERY,
    storage
);

export const preferencesValueAtom = unwrap(
    notificationPreferencesAtom,
    (previous) => previous ?? INITIAL_PREFERENCES
);

export const deliveryValueAtom = unwrap(
    notificationDeliveryAtom,
    (previous) => previous ?? INITIAL_DELIVERY
);

export const plannedNotificationsAtom = atom(async (get) => {
    const preferences = get(preferencesValueAtom);

    if (!preferences.enabled) {
        return [];
    }

    const user = await get(userAtom);
    const certifications = await get(certificationByUserAtom);

    return planNotifications({
        progression: get(progressionValueAtom),
        streak: get(streakValueAtom),
        dueReviews: get(dueReviewsAtom).length,
        readiness: get(readinessAtom),
        cooldown: get(cooldownAtom),
        certification: certifications[user.id] ?? null,
        skillTree: get(skillTreeAtom),
        delivery: get(deliveryValueAtom),
        preferredHour: preferences.preferredHour,
    });
});

export const syncNotificationsAtom = atom(null, async (get, set) => {
    const planned = await get(plannedNotificationsAtom);
    const scheduled = await syncScheduledNotifications(planned);

    if (scheduled > 0 && planned.length) {
        const delivery = await get(notificationDeliveryAtom);
        set(notificationDeliveryAtom, registerSent(delivery, planned[0]));
    }

    return scheduled;
});

export const recordNotificationOpenedAtom = atom(null, async (get, set) => {
    const delivery = await get(notificationDeliveryAtom);
    set(notificationDeliveryAtom, registerOpened(delivery));
});

export const learnPracticeHourAtom = atom(
    null,
    async (get, set, reference: Date = new Date()) => {
        const hour = reference.getHours();

        if (isQuietHour(hour)) {
            return;
        }

        const preferences = await get(notificationPreferencesAtom);

        if (preferences.preferredHour === hour) {
            return;
        }

        set(notificationPreferencesAtom, {...preferences, preferredHour: hour});
    }
);

export const notificationPermissionAtom = atom<boolean | null>(null);

export const refreshNotificationPermissionAtom = atom(
    null,
    async (_get, set) => {
        const granted = await hasNotificationPermission();
        set(notificationPermissionAtom, granted);
        return granted;
    }
);

export const requestNotificationsAtom = atom(null, async (get, set) => {
    const granted = await requestNotificationPermission();
    set(notificationPermissionAtom, granted);

    if (granted) {
        const preferences = await get(notificationPreferencesAtom);
        set(notificationPreferencesAtom, {...preferences, enabled: true});
        await set(syncNotificationsAtom);
    }

    return granted;
});

export const setNotificationsEnabledAtom = atom(
    null,
    async (get, set, enabled: boolean) => {
        const preferences = await get(notificationPreferencesAtom);
        set(notificationPreferencesAtom, {...preferences, enabled});

        if (!enabled) {
            await syncScheduledNotifications([]);
        }
    }
);
