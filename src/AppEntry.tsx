import {isTV} from "@/constants/platform";
import {initBackgroundFetch} from "./hooks/useBackgroundFetch";
import {initNotification} from "./hooks/useNotification";
import {initFetchUpdate} from "./hooks/useUpdates";

if (!isTV) {
    initBackgroundFetch();
    initNotification();
}
initFetchUpdate();

import "expo-router/entry";
