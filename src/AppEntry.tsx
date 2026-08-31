import {isTV} from "@/constants/platform";
import "@/i18n";
import {initBackgroundFetch} from "./hooks/useBackgroundFetch";
import {initNotification} from "./hooks/useNotification";
import {initFetchUpdate} from "./hooks/useUpdates";

if (!isTV) {
    initBackgroundFetch();
    initNotification();
}
initFetchUpdate();

import "expo-router/entry";
