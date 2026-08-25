import * as Crypto from "expo-crypto";
import {createRandomId, deriveDeviceId} from "./device";

const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe("createRandomId", () => {
    it("always produces a well formed uuid", () => {
        for (let index = 0; index < 50; index += 1) {
            expect(createRandomId()).toMatch(UUID_PATTERN);
        }
    });

    it("produces distinct values", () => {
        const ids = new Set(Array.from({length: 50}, () => createRandomId()));

        expect(ids.size).toBe(50);
    });
});

describe("deriveDeviceId", () => {
    it("falls back to a random uuid when no vendor id is available", async () => {
        await expect(deriveDeviceId(null)).resolves.toMatch(UUID_PATTERN);
    });

    it("falls back when the digest is unusable", async () => {
        await expect(deriveDeviceId("vendor")).resolves.toMatch(UUID_PATTERN);
    });

    it("is stable for the same vendor id when the digest works", async () => {
        const digest = jest
            .spyOn(Crypto, "digestStringAsync")
            .mockResolvedValue("a".repeat(64));

        const first = await deriveDeviceId("vendor-1");
        const second = await deriveDeviceId("vendor-1");

        expect(first).toBe(second);
        expect(first).toMatch(UUID_PATTERN);

        digest.mockRestore();
    });

    it("derives different ids for different devices", async () => {
        const digest = jest
            .spyOn(Crypto, "digestStringAsync")
            .mockImplementation(async (_algorithm, data) =>
                data.includes("vendor-1") ? "1".repeat(64) : "2".repeat(64)
            );

        expect(await deriveDeviceId("vendor-1")).not.toBe(
            await deriveDeviceId("vendor-2")
        );

        digest.mockRestore();
    });

    it("recovers when the digest throws", async () => {
        const digest = jest
            .spyOn(Crypto, "digestStringAsync")
            .mockRejectedValue(new Error("native module unavailable"));

        await expect(deriveDeviceId("vendor")).resolves.toMatch(UUID_PATTERN);

        digest.mockRestore();
    });
});
