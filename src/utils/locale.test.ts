import {
    isLocale,
    isLocalePreference,
    resolveLocale,
    resolvePreferredLocale,
} from "@/utils/locale";

describe("resolveLocale", () => {
    it("matches an exact supported tag", () => {
        expect(resolveLocale(["es"])).toBe("es");
    });

    it("collapses a regional variant onto its base language", () => {
        expect(resolveLocale(["es-419"])).toBe("es");
        expect(resolveLocale(["es_MX"])).toBe("es");
        expect(resolveLocale(["EN-GB"])).toBe("en");
    });

    it("walks the device list in preference order", () => {
        expect(resolveLocale(["fr-FR", "pt-BR", "es-ES", "en-US"])).toBe("es");
    });

    it("falls back to English when nothing is shipped", () => {
        expect(resolveLocale(["fr-FR", "de-DE"])).toBe("en");
    });

    it("ignores empty entries rather than treating them as a match", () => {
        expect(resolveLocale([null, undefined, "", "es-AR"])).toBe("es");
    });

    it("falls back when the device reports nothing at all", () => {
        expect(resolveLocale([])).toBe("en");
    });
});

describe("resolvePreferredLocale", () => {
    it("lets an explicit choice override the device", () => {
        expect(resolvePreferredLocale("en", ["es-ES"])).toBe("en");
        expect(resolvePreferredLocale("es", ["en-US"])).toBe("es");
    });

    it("defers to the device list while the preference is 'system'", () => {
        expect(resolvePreferredLocale("system", ["es-ES"])).toBe("es");
        expect(resolvePreferredLocale("system", ["ja-JP"])).toBe("en");
    });
});

describe("guards", () => {
    it("recognises shipped locales only", () => {
        expect(isLocale("es")).toBe(true);
        expect(isLocale("fr")).toBe(false);
        expect(isLocale(42)).toBe(false);
    });

    it("accepts 'system' as a preference but not as a locale", () => {
        expect(isLocalePreference("system")).toBe(true);
        expect(isLocale("system")).toBe(false);
    });
});
