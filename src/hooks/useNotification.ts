import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import {router} from "expo-router";
import {Alert, Linking, Platform} from "react-native";
import {PATHS} from "@/constants/routes";
import {STORAGE_ID} from "@/constants/storage";
import {STRINGS} from "@/constants/strings";
import {theme} from "@/theme/colors";
import {
    ANDROID_CHANNEL_ID,
    scheduleLocalNotification,
} from "@/utils/notification";
import {storage} from "@/utils/storage";

const ANDROID_CONFIG = {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: theme().accent,
};

const handleNotificationConfig = {
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
};

export const initNotification = () => {
    const registerForPushNotificationsAsync = async () => {
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync(
                ANDROID_CHANNEL_ID,
                ANDROID_CONFIG
            );
        }

        const {status: existingStatus} =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== Notifications.PermissionStatus.GRANTED) {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus;
    };

    const getToken = async (): Promise<string> => {
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        const token = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        return token;
    };

    registerForPushNotificationsAsync()
        .then(async (finalStatus) => {
            if (![Notifications.PermissionStatus.GRANTED].includes(finalStatus))
                await Alert.alert(
                    STRINGS.notification.alert_permission_title,
                    STRINGS.notification.alert_permission_message,
                    [
                        {
                            text: STRINGS.notification.alert_permission_button,
                            onPress: () => Linking.openSettings(),
                        },
                    ]
                );
            return finalStatus;
        })
        .then(async () => {
            const token = await getToken();
            storage.setItem(STORAGE_ID.notificationToken, token);
        })
        .then(() => {
            Notifications.setNotificationHandler({
                handleNotification: async () => handleNotificationConfig,
            });
            Notifications.addNotificationReceivedListener((notification) => {
                const title =
                    notification.request.content.title || STRINGS.appName;
                const body =
                    notification.request.content.body || STRINGS.appName;
                const url = notification.request.content.data.url as string;
                scheduleLocalNotification(title, body as string, {url});
            });
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const title =
                        response.notification.request.content.body ||
                        STRINGS.appName;
                    const url = response.notification.request.content.data
                        .url as string;
                    if (url) router.push(PATHS.WEB(url, title));
                }
            );
        });
};
