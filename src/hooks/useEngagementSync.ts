import {useSetAtom} from "jotai";
import {useEffect} from "react";
import {AppState} from "react-native";
import {isTV} from "@/constants/platform";
import {setNotificationOpenHandler} from "@/hooks/useNotification";
import {
    recordNotificationOpenedAtom,
    refreshNotificationPermissionAtom,
    syncNotificationsAtom,
} from "@/stores/notifications";

export const useEngagementSync = () => {
    const syncNotifications = useSetAtom(syncNotificationsAtom);
    const recordOpened = useSetAtom(recordNotificationOpenedAtom);
    const refreshPermission = useSetAtom(refreshNotificationPermissionAtom);

    useEffect(() => {
        if (isTV) return;

        setNotificationOpenHandler(() => {
            void recordOpened();
        });

        void refreshPermission();
        void syncNotifications();

        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                void refreshPermission();
                return;
            }

            void syncNotifications();
        });

        return () => subscription.remove();
    }, [recordOpened, refreshPermission, syncNotifications]);
};
