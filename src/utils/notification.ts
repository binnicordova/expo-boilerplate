import * as Notifications from "expo-notifications";

export const ANDROID_CHANNEL_ID = "default";

export const ENGAGEMENT_MARKER = "engagement";

export const scheduleLocalNotification = async (
    title: string,
    body: string,
    data: {[key: string]: unknown}
) =>
    Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: data,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            channelId: ANDROID_CHANNEL_ID,
            seconds: 2,
            repeats: false,
        },
    });

export const scheduleNotificationAt = async (payload: {
    title: string;
    body: string;
    fireAt: Date;
    data: {[key: string]: unknown};
}) =>
    Notifications.scheduleNotificationAsync({
        content: {
            title: payload.title,
            body: payload.body,
            data: {...payload.data, [ENGAGEMENT_MARKER]: true},
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: ANDROID_CHANNEL_ID,
            date: payload.fireAt,
        },
    });

export const cancelEngagementNotifications = async () => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();

    await Promise.all(
        scheduled
            .filter((entry) => entry.content.data?.[ENGAGEMENT_MARKER] === true)
            .map((entry) =>
                Notifications.cancelScheduledNotificationAsync(entry.identifier)
            )
    );
};
