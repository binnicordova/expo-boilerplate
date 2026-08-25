import * as Application from "expo-application";
import * as Crypto from "expo-crypto";
import {Platform} from "react-native";

const UUID_SEGMENTS = [8, 4, 4, 4, 12];
const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HASH_PATTERN = /^[0-9a-f]{32,}$/i;

const formatAsUuid = (hash: string): string => {
    let cursor = 0;

    return UUID_SEGMENTS.map((length) => {
        const segment = hash.slice(cursor, cursor + length);
        cursor += length;
        return segment;
    }).join("-");
};

const fillPseudoRandom = (bytes: Uint8Array): Uint8Array => {
    for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = Math.floor(Math.random() * 256);
    }

    return bytes;
};

const getRandomBytes = (): Uint8Array => {
    const bytes = new Uint8Array(16);

    try {
        const filled = Crypto.getRandomValues(bytes);

        return filled.some((byte) => byte !== 0)
            ? filled
            : fillPseudoRandom(bytes);
    } catch (_error) {
        return fillPseudoRandom(bytes);
    }
};

const uuidFromBytes = (bytes: Uint8Array): string => {
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, "0")
    ).join("");

    return formatAsUuid(hex);
};

export const createRandomId = (): string => {
    const generated =
        typeof Crypto.randomUUID === "function" ? Crypto.randomUUID() : null;

    return generated && UUID_PATTERN.test(generated)
        ? generated
        : uuidFromBytes(getRandomBytes());
};

export const getVendorId = async (): Promise<string | null> => {
    try {
        if (Platform.OS === "android") {
            return Application.getAndroidId();
        }

        if (Platform.OS === "ios") {
            return await Application.getIosIdForVendorAsync();
        }

        return null;
    } catch (_error) {
        return null;
    }
};

export const deriveDeviceId = async (
    vendorId: string | null
): Promise<string> => {
    if (!vendorId) {
        return createRandomId();
    }

    try {
        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            `${Application.applicationId ?? "expofs"}:${vendorId}`
        );

        return HASH_PATTERN.test(hash) ? formatAsUuid(hash) : createRandomId();
    } catch (_error) {
        return createRandomId();
    }
};
