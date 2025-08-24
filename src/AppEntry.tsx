import {initBackgroundFetch} from "./hooks/useBackgroundFetch";
import {initNotification} from "./hooks/useNotification";
import {initFetchUpdate} from "./hooks/useUpdates";

initBackgroundFetch();
initNotification();
initFetchUpdate();

import "expo-router/entry";
