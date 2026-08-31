import {
    DAILY_SLOT_HOURS,
    MAX_SCHEDULED,
    PLAN_HORIZON_DAYS,
    QUIET_HOURS,
} from "@/constants/notifications";
import type {Readiness} from "@/models/certification";
import type {ProgressionState} from "@/models/progression";
import type {CertificationRecord} from "@/stores/user";
import {
    type EngagementSnapshot,
    getLearnerTier,
    INITIAL_DELIVERY,
    nextAllowedSlot,
    planNotifications,
    registerOpened,
    registerSent,
} from "./engagement";
import {INITIAL_PROGRESSION} from "./progression";
import {INITIAL_STREAK} from "./streak";

const at = (iso: string) => new Date(iso);

const readiness = (overrides: Partial<Readiness> = {}): Readiness => ({
    eligible: false,
    progress: 0,
    requirements: [],
    ...overrides,
});

const snapshot = (
    overrides: Partial<EngagementSnapshot> = {}
): EngagementSnapshot => ({
    progression: INITIAL_PROGRESSION,
    streak: INITIAL_STREAK,
    dueReviews: 0,
    readiness: readiness(),
    cooldown: {blocked: false, availableAt: null, remainingMs: 0},
    certification: null,
    skillTree: [],
    delivery: INITIAL_DELIVERY,
    preferredHour: 19,
    ...overrides,
});

const activeStreak = (lastActiveDay: string, days = 5) => ({
    ...INITIAL_STREAK,
    currentStreak: days,
    longestStreak: days,
    lastActiveDay,
});

describe("getLearnerTier", () => {
    it("classifies a brand new user as a newcomer", () => {
        expect(getLearnerTier(INITIAL_PROGRESSION, readiness(), null)).toBe(
            "newcomer"
        );
    });

    it("promotes to learner once practice accumulates", () => {
        expect(
            getLearnerTier(
                {...INITIAL_PROGRESSION, answered: 40},
                readiness(),
                null
            )
        ).toBe("learner");
    });

    it("promotes to candidate as the exam comes into reach", () => {
        expect(
            getLearnerTier(
                {...INITIAL_PROGRESSION, answered: 80},
                readiness({progress: 0.8}),
                null
            )
        ).toBe("candidate");
    });

    it("recognises a valid certification", () => {
        const certification = {
            validUntil: new Date(Date.now() + 86_400_000).toISOString(),
        } as CertificationRecord;

        expect(
            getLearnerTier(INITIAL_PROGRESSION, readiness(), certification)
        ).toBe("certified");
    });

    it("drops a holder of an expired certification back to their practice tier", () => {
        const certification = {
            validUntil: new Date(Date.now() - 86_400_000).toISOString(),
        } as CertificationRecord;

        expect(
            getLearnerTier(
                {...INITIAL_PROGRESSION, answered: 40},
                readiness(),
                certification
            )
        ).toBe("learner");
    });
});

describe("quiet hours", () => {
    it("pushes a late night slot to the next morning", () => {
        const slot = nextAllowedSlot(at("2026-05-01T23:30:00"));

        expect(slot.getDate()).toBe(2);
        expect(slot.getHours()).toBe(QUIET_HOURS.end);
    });

    it("pushes an early morning slot to the start of the day", () => {
        const slot = nextAllowedSlot(at("2026-05-01T03:00:00"));

        expect(slot.getDate()).toBe(1);
        expect(slot.getHours()).toBe(QUIET_HOURS.end);
    });

    it("leaves a daytime slot untouched", () => {
        const slot = nextAllowedSlot(at("2026-05-01T14:00:00"));

        expect(slot.getHours()).toBe(14);
    });

    it("never schedules inside quiet hours", () => {
        const [planned] = planNotifications(
            snapshot({streak: activeStreak("2026-04-30")}),
            at("2026-05-01T22:00:00")
        );

        const hour = new Date(planned.fireAt).getHours();

        expect(hour).toBeGreaterThanOrEqual(QUIET_HOURS.end);
        expect(hour).toBeLessThan(QUIET_HOURS.start);
    });
});

describe("planNotifications", () => {
    it("always schedules a full horizon, even with no signals", () => {
        const planned = planNotifications(
            snapshot(),
            at("2026-05-01T07:00:00")
        );

        expect(planned.length).toBeGreaterThan(PLAN_HORIZON_DAYS);
        expect(planned.length).toBeLessThanOrEqual(MAX_SCHEDULED);
    });

    it("fills roughly one slot per configured hour per day", () => {
        const planned = planNotifications(
            snapshot(),
            at("2026-05-01T07:00:00")
        );
        const hours = new Set(
            planned.map((entry) => new Date(entry.fireAt).getHours())
        );

        for (const hour of DAILY_SLOT_HOURS) {
            expect(hours.has(hour)).toBe(true);
        }
    });

    it("schedules every notification in the future", () => {
        const now = at("2026-05-01T14:30:00");
        const planned = planNotifications(snapshot(), now);

        for (const entry of planned) {
            expect(new Date(entry.fireAt).getTime()).toBeGreaterThan(
                now.getTime()
            );
        }
    });

    it("never schedules inside quiet hours", () => {
        const planned = planNotifications(
            snapshot({streak: activeStreak("2026-04-30")}),
            at("2026-05-01T23:00:00")
        );

        for (const entry of planned) {
            const hour = new Date(entry.fireAt).getHours();
            expect(hour).toBeGreaterThanOrEqual(QUIET_HOURS.end);
            expect(hour).toBeLessThan(QUIET_HOURS.start);
        }
    });

    it("gives the earliest slots to the highest priority signals", () => {
        const planned = planNotifications(
            snapshot({
                streak: activeStreak("2026-04-30"),
                dueReviews: 12,
                readiness: readiness({eligible: true, progress: 1}),
            }),
            at("2026-05-01T07:00:00")
        );

        expect(planned[0].trigger).toBe("streak-save");
        expect(planned[0].title).toEqual({
            key: "notifications.streakSave.title",
            params: {count: 5},
        });
    });

    it("falls back to level-appropriate copy once signals run out", () => {
        const newcomer = planNotifications(
            snapshot(),
            at("2026-05-01T07:00:00")
        );

        const candidate = planNotifications(
            snapshot({
                progression: {...INITIAL_PROGRESSION, answered: 90},
                readiness: readiness({progress: 0.9}),
            }),
            at("2026-05-01T07:00:00")
        );

        expect(newcomer[0].tier).toBe("newcomer");
        expect(candidate[0].tier).toBe("candidate");
        expect(newcomer[0].body).not.toEqual(candidate[0].body);
    });

    it("keeps every notification unique so none are dropped", () => {
        const planned = planNotifications(
            snapshot({streak: activeStreak("2026-04-30"), dueReviews: 4}),
            at("2026-05-01T07:00:00")
        );

        expect(new Set(planned.map((entry) => entry.id)).size).toBe(
            planned.length
        );
    });

    it("announces the exam the moment it unlocks", () => {
        const [planned] = planNotifications(
            snapshot({
                progression: {...INITIAL_PROGRESSION, answered: 80},
                streak: activeStreak("2026-05-01"),
                readiness: readiness({eligible: true, progress: 1}),
            }),
            at("2026-05-01T07:00:00")
        );

        expect(planned.trigger).toBe("exam-unlocked");
        expect(planned.path).toBe("/exam");
    });

    it("surfaces due reviews with an accurate count", () => {
        const [planned] = planNotifications(
            snapshot({streak: activeStreak("2026-05-01"), dueReviews: 7}),
            at("2026-05-01T07:00:00")
        );

        expect(planned.trigger).toBe("reviews-due");
        expect(planned.title).toEqual({
            key: "notifications.reviewsDue.title",
            params: {count: 7},
        });
    });

    it("names the weakest domain when winning a lapsed user back", () => {
        const progression: ProgressionState = {
            ...INITIAL_PROGRESSION,
            answered: 60,
            masteryByDomain: {
                react: {
                    domain: "react",
                    answered: 30,
                    correct: 27,
                    score: 0.9,
                    difficultyReached: 2,
                },
                node: {
                    domain: "node",
                    answered: 30,
                    correct: 9,
                    score: 0.3,
                    difficultyReached: 1,
                },
            },
        };

        const planned = planNotifications(
            snapshot({
                progression,
                streak: {...activeStreak("2026-04-28"), currentStreak: 4},
            }),
            at("2026-05-01T07:00:00")
        );

        const winBack = planned.find((entry) => entry.trigger === "win-back");

        expect(winBack?.body).toEqual({
            key: "notifications.winBack.bodyWeakest",
            params: {domain: "node"},
        });
    });

    it("stays under the platform pending notification limit", () => {
        const planned = planNotifications(
            snapshot({streak: activeStreak("2026-04-30"), dueReviews: 30}),
            at("2026-05-01T07:00:00")
        );

        expect(planned.length).toBeLessThanOrEqual(MAX_SCHEDULED);
        expect(planned.length).toBeLessThan(64);
    });
});

describe("delivery accounting", () => {
    it("counts a send as ignored until it is opened", () => {
        const planned = {id: "x"} as never;
        const sent = registerSent(
            INITIAL_DELIVERY,
            planned,
            at("2026-05-01T10:00:00")
        );

        expect(sent.sent).toBe(1);
        expect(sent.consecutiveIgnored).toBe(1);
        expect(sent.lastTriggerId).toBe("x");
    });

    it("clears the ignore streak when the user opens one", () => {
        const opened = registerOpened({
            ...INITIAL_DELIVERY,
            sent: 4,
            consecutiveIgnored: 3,
        });

        expect(opened.opened).toBe(1);
        expect(opened.consecutiveIgnored).toBe(0);
    });

    it("keeps only a two week window of send history", () => {
        let delivery = INITIAL_DELIVERY;

        for (let index = 0; index < 20; index += 1) {
            delivery = registerSent(
                delivery,
                {id: `n${index}`} as never,
                new Date(2026, 4, 1 + index)
            );
        }

        expect(delivery.sentDayKeys).toHaveLength(14);
    });
});
