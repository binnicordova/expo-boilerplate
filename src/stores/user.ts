import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";
import {CERTIFICATION_VALIDITY_MONTHS} from "@/constants/certification";
import {STORAGE_ID} from "@/constants/storage";
import {ensureDeviceAtom} from "@/stores/device";
import {addMonths} from "@/utils/date";
import {storage} from "@/utils/storage";

const DEFAULT_USER_NAME = "Certification Candidate";

export type UserProfile = {
    id: string;
    name: string;
};

export type CertificationRecord = {
    userId: string;
    name: string;
    attemptId: string;
    score: number;
    total: number;
    percentage: number;
    expertScore: number;
    passed: boolean;
    issuedAt: string;
    validUntil: string;
};

export const userAtom = atomWithStorage<UserProfile>(
    STORAGE_ID.user,
    {
        id: "",
        name: DEFAULT_USER_NAME,
    },
    storage
);

export const certificationByUserAtom = atomWithStorage<
    Record<string, CertificationRecord>
>(STORAGE_ID.certifications, {}, storage);

export const ensureUserAtom = atom(null, async (get, set) => {
    const device = await set(ensureDeviceAtom);
    const user = await get(userAtom);

    if (user?.id === device.id) {
        return user;
    }

    const profile: UserProfile = {
        id: device.id,
        name: user?.name || DEFAULT_USER_NAME,
    };

    set(userAtom, profile);
    return profile;
});

export const renameUserAtom = atom(null, async (get, set, name: string) => {
    const user = await get(userAtom);
    set(userAtom, {...user, name: name.trim() || DEFAULT_USER_NAME});
});

export const issueCertificationAtom = atom(
    null,
    async (
        get,
        set,
        payload: {
            attemptId: string;
            score: number;
            total: number;
            percentage: number;
            expertScore: number;
            issuedAt: string;
        }
    ) => {
        const user = await get(userAtom);

        if (!user?.id) {
            return null;
        }

        const record: CertificationRecord = {
            userId: user.id,
            name: user.name,
            attemptId: payload.attemptId,
            score: payload.score,
            total: payload.total,
            percentage: payload.percentage,
            expertScore: payload.expertScore,
            passed: true,
            issuedAt: payload.issuedAt,
            validUntil: addMonths(
                payload.issuedAt,
                CERTIFICATION_VALIDITY_MONTHS
            ).toISOString(),
        };

        set(certificationByUserAtom, {
            ...(await get(certificationByUserAtom)),
            [user.id]: record,
        });

        return record;
    }
);
