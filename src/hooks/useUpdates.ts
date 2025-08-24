import * as Updates from "expo-updates";

const TAG = "[useUpdates]";

export const initFetchUpdate = async () => {
    if (__DEV__) {
        return;
    }

    try {
        const update = await Updates.checkForUpdateAsync();
        console.log(TAG, `Update available: ${update.isAvailable}`);
        if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
        }
    } catch (error) {
        // You can also add an alert() here if needed for your purposes
        console.log(TAG, `Error fetching latest Expo update: ${error}`);
    }
};
