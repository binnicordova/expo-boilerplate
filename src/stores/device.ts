import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";
import {STORAGE_ID} from "@/constants/storage";
import type {DeviceIdentity} from "@/models/progression";
import {deriveDeviceId, getVendorId} from "@/utils/device";
import {storage} from "@/utils/storage";

const EMPTY_IDENTITY: DeviceIdentity = {
    id: "",
    vendorId: null,
    installedAt: "",
};

export const deviceAtom = atomWithStorage<DeviceIdentity>(
    STORAGE_ID.device,
    EMPTY_IDENTITY,
    storage
);

export const ensureDeviceAtom = atom(null, async (get, set) => {
    const existing = await get(deviceAtom);

    if (existing?.id) {
        return existing;
    }

    const vendorId = await getVendorId();
    const identity: DeviceIdentity = {
        id: await deriveDeviceId(vendorId),
        vendorId,
        installedAt: new Date().toISOString(),
    };

    set(deviceAtom, identity);
    return identity;
});
