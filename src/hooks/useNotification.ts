import * as Notifications from "expo-notifications";
import {router} from "expo-router";
import {Alert, Linking, Platform} from "react-native";
import {isTV} from "@/constants/platform";
import {PATHS} from "@/constants/routes";
import {STRINGS} from "@/constants/strings";
import {requestNotificationPermission} from "@/services/notifications";
import {theme} from "@/theme/colors";
import {
    ANDROID_CHANNEL_ID,
    ENGAGEMENT_MARKER,
    scheduleLocalNotification,
} from "@/utils/notification";

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

let onNotificationOpened: (() => void) | undefined;

export const setNotificationOpenHandler = (handler: () => void) => {
    onNotificationOpened = handler;
};

export const promptNotificationSettings = () =>
    Alert.alert(
        STRINGS.notification.alert_permission_title,
        STRINGS.notification.alert_permission_message,
        [
            {
                text: STRINGS.notification.alert_permission_button,
                onPress: () => Linking.openSettings(),
            },
        ]
    );

export const initNotification = () => {
    if (isTV) return;

    void requestNotificationPermission();

    if (Platform.OS === "android") {
        void Notifications.setNotificationChannelAsync(
            ANDROID_CHANNEL_ID,
            ANDROID_CONFIG
        );
    }

    Notifications.setNotificationHandler({
        handleNotification: async () => handleNotificationConfig,
    });

    Notifications.addNotificationReceivedListener((notification) => {
        const {content} = notification.request;
        const isLocal = content.data?.[ENGAGEMENT_MARKER] === true;
        const url = content.data?.url as string | undefined;

        if (isLocal || !url) {
            return;
        }

        void scheduleLocalNotification(
            content.title || STRINGS.appName,
            content.body || STRINGS.appName,
            {url}
        );
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
        const {content} = response.notification.request;
        const path = content.data?.path as string | undefined;
        const url = content.data?.url as string | undefined;

        onNotificationOpened?.();

        if (path) {
            router.push(path as never);
            return;
        }

        if (url) {
            router.push(PATHS.WEB(url, content.body || STRINGS.appName));
        }
    });
};
