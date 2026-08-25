import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import {isTV} from "@/constants/platform";
import {planEngagementNotifications, syncCertifications, TASKS} from "@/tasks";

const TASK_INTERVAL = 6 * 60;
const TASK_CONFIGURATION: BackgroundTask.BackgroundTaskOptions = {
    minimumInterval: TASK_INTERVAL,
};

if (!TaskManager.isTaskDefined(TASKS.PLAN_NOTIFICATIONS)) {
    TaskManager.defineTask(
        TASKS.PLAN_NOTIFICATIONS,
        planEngagementNotifications
    );
}

if (!TaskManager.isTaskDefined(TASKS.SYNC_CERTIFICATIONS)) {
    TaskManager.defineTask(TASKS.SYNC_CERTIFICATIONS, syncCertifications);
}

const registerTaskIfNeeded = async (taskName: TASKS) => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(taskName);
    if (!isRegistered) {
        await BackgroundTask.registerTaskAsync(taskName, TASK_CONFIGURATION);
    }
};

export const initBackgroundFetch = async () => {
    if (isTV) return;

    const status = await BackgroundTask.getStatusAsync();
    if (status === BackgroundTask.BackgroundTaskStatus.Available) {
        await registerTaskIfNeeded(TASKS.PLAN_NOTIFICATIONS);
        await registerTaskIfNeeded(TASKS.SYNC_CERTIFICATIONS);
    }
};
