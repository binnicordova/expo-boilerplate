import {createStore} from "jotai";
import {
    hasNotificationPermission,
    syncScheduledNotifications,
} from "@/services/notifications";
import {
    deliveryValueAtom,
    learnPracticeHourAtom,
    notificationPreferencesAtom,
    recordNotificationOpenedAtom,
    setNotificationsEnabledAtom,
    syncNotificationsAtom,
} from "@/stores/notifications";
import {streakAtom} from "@/stores/retention";
import {toDayKey} from "@/utils/date";
import {INITIAL_STREAK} from "@/utils/streak";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("@/services/notifications", () => ({
    hasNotificationPermission: jest.fn(async () => true),
    requestNotificationPermission: jest.fn(async () => true),
    syncScheduledNotifications: jest.fn(async () => 1),
}));

const syncMock = syncScheduledNotifications as jest.MockedFunction<
    typeof syncScheduledNotifications
>;

const permissionMock = hasNotificationPermission as jest.MockedFunction<
    typeof hasNotificationPermission
>;

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const yesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return toDayKey(date);
};

describe("notification store", () => {
    beforeEach(() => {
        syncMock.mockClear();
        syncMock.mockResolvedValue(1);
        permissionMock.mockResolvedValue(true);
    });

    it("schedules a full plan even for a user with no signals", async () => {
        const store = createStore();
        await flush();

        await store.set(syncNotificationsAtom);

        const planned = syncMock.mock.calls[0][0];
        expect(planned.length).toBeGreaterThan(7);
        expect(planned.every((entry) => Boolean(entry.title))).toBe(true);
    });

    it("schedules a streak save and records the send", async () => {
        const store = createStore();

        store.set(streakAtom, {
            ...INITIAL_STREAK,
            currentStreak: 4,
            longestStreak: 4,
            lastActiveDay: yesterday(),
        });

        await flush();

        await store.set(syncNotificationsAtom);

        const planned = syncMock.mock.calls[0][0];
        expect(planned.length).toBeGreaterThan(1);
        expect(planned[0].trigger).toBe("streak-save");

        const delivery = store.get(deliveryValueAtom);
        expect(delivery.sent).toBe(1);
        expect(delivery.consecutiveIgnored).toBe(1);
    });

    it("clears the ignore counter when a notification is opened", async () => {
        const store = createStore();

        store.set(streakAtom, {
            ...INITIAL_STREAK,
            currentStreak: 4,
            lastActiveDay: yesterday(),
        });

        await flush();
        await store.set(syncNotificationsAtom);
        await store.set(recordNotificationOpenedAtom);
        await flush();

        const delivery = store.get(deliveryValueAtom);
        expect(delivery.opened).toBe(1);
        expect(delivery.consecutiveIgnored).toBe(0);
    });

    it("cancels everything when the user opts out", async () => {
        const store = createStore();
        await flush();

        await store.set(setNotificationsEnabledAtom, false);
        await flush();

        expect(syncMock).toHaveBeenCalledWith([]);

        syncMock.mockClear();
        await store.set(syncNotificationsAtom);

        expect(syncMock).toHaveBeenCalledWith([]);
    });

    it("learns the hour the user actually practises", async () => {
        const store = createStore();
        await flush();

        await store.set(learnPracticeHourAtom, new Date(2026, 4, 1, 14, 30));
        await flush();

        expect(
            (await store.get(notificationPreferencesAtom)).preferredHour
        ).toBe(14);
    });

    it("ignores a practice hour that falls inside quiet hours", async () => {
        const store = createStore();
        await flush();

        const before = (await store.get(notificationPreferencesAtom))
            .preferredHour;

        await store.set(learnPracticeHourAtom, new Date(2026, 4, 1, 2, 0));
        await flush();

        expect(
            (await store.get(notificationPreferencesAtom)).preferredHour
        ).toBe(before);
    });

    it("does not record a send when nothing was scheduled", async () => {
        syncMock.mockResolvedValue(0);

        const store = createStore();

        store.set(streakAtom, {
            ...INITIAL_STREAK,
            currentStreak: 4,
            lastActiveDay: yesterday(),
        });

        await flush();
        await store.set(syncNotificationsAtom);

        expect(store.get(deliveryValueAtom).sent).toBe(0);
    });
});
