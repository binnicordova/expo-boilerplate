import crypto from "expo-crypto";
import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";
import {STORAGE_ID} from "@/constants/storage";
import {storage} from "@/utils/storage";

const PASSING_THRESHOLD = 0.7;
const CERTIFICATION_VALIDITY_MONTHS = 3;
const DEFAULT_USER_NAME = "Quiz Candidate";

export type UserProfile = {
    id: string;
    name: string;
};

export type CertificationRecord = {
    userId: string;
    name: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    issuedAt: string;
    validUntil: string | null;
};

const createUserProfile = (): UserProfile => ({
    id: crypto.randomUUID(),
    name: DEFAULT_USER_NAME,
});

const addMonths = (baseIsoDate: string, months: number) => {
    const targetDate = new Date(baseIsoDate);
    targetDate.setMonth(targetDate.getMonth() + months);
    return targetDate.toISOString();
};

const createCertificationRecord = (payload: {
    userId: string;
    name: string;
    score: number;
    total: number;
}): CertificationRecord => {
    const percentage = Math.round(
        (payload.score / Math.max(1, payload.total)) * 100
    );
    const passed = percentage >= PASSING_THRESHOLD * 100;
    const issuedAt = new Date().toISOString();

    return {
        userId: payload.userId,
        name: payload.name,
        score: payload.score,
        total: payload.total,
        percentage,
        passed,
        issuedAt,
        validUntil: passed
            ? addMonths(issuedAt, CERTIFICATION_VALIDITY_MONTHS)
            : null,
    };
};

export const userAtom = atomWithStorage<UserProfile>(
    STORAGE_ID.user,
    {
        id: "",
        name: DEFAULT_USER_NAME,
    },
    // We add the option to bypass the Promise wrapping by not specifying asynchronous behaviors or utilizing storage custom methods if storage resolves as promise, but Jotai's atomWithStorage creates an atom that can return T | Promise<T> if the storage backend is async.
    // In React Native / Expo, storage is indeed async. Let's make sure our read-sets are safe.
    storage
);

export const certificationByUserAtom = atomWithStorage<
    Record<string, CertificationRecord>
>(STORAGE_ID.certifications, {}, storage);

export const ensureUserAtom = atom(null, async (get, set) => {
    const user = await get(userAtom);
    if (!user?.id) {
        set(userAtom, createUserProfile());
    }
});

export const setCertificationForCurrentUserAtom = atom(
    null,
    async (get, set, payload: {score: number; total: number}) => {
        const user = await get(userAtom);

        if (!user?.id) {
            return;
        }

        const certifications = await get(certificationByUserAtom);
        const record = createCertificationRecord({
            userId: user.id,
            name: user.name,
            score: payload.score,
            total: payload.total,
        });

        set(certificationByUserAtom, {
            ...certifications,
            [user.id]: record,
        });
    }
);
