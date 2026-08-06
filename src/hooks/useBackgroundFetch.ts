import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import {isTV} from "@/constants/platform";
import {notifyMatchHits, syncCertifications, TASKS} from "@/tasks";

const TASK_INTERVAL = 15;
const TASK_CONFIGURATION: BackgroundTask.BackgroundTaskOptions = {
    minimumInterval: TASK_INTERVAL,
};

if (!TaskManager.isTaskDefined(TASKS.NOTIFY_PENDING_QUIZ)) {
    TaskManager.defineTask(TASKS.NOTIFY_PENDING_QUIZ, notifyMatchHits);
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
        await registerTaskIfNeeded(TASKS.NOTIFY_PENDING_QUIZ);
        await registerTaskIfNeeded(TASKS.SYNC_CERTIFICATIONS);
    }
};
