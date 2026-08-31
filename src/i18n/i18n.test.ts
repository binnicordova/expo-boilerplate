import {LOCALES} from "@/constants/locales";
import {changeLocale, i18n, resources, translate, translateRef} from "@/i18n";
import {en} from "@/i18n/locales/en";
import {es} from "@/i18n/locales/es";

type Catalogue = Record<string, unknown>;

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

const flatten = (value: Catalogue, prefix = ""): Record<string, string> => {
    const entries: Record<string, string> = {};

    for (const [key, entry] of Object.entries(value)) {
        const path = prefix ? `${prefix}.${key}` : key;

        if (typeof entry === "string") {
            entries[path] = entry;
            continue;
        }

        Object.assign(entries, flatten(entry as Catalogue, path));
    }

    return entries;
};

const baseKey = (key: string) => key.replace(PLURAL_SUFFIX, "");

const placeholders = (value: string) =>
    [...value.matchAll(/{{(\w+)}}/g)].map((match) => match[1]).sort();

/**
 * Product names and pure-punctuation templates read the same in both
 * languages; anything else matching English is copy that was never translated.
 */
const INTENTIONALLY_IDENTICAL = [
    "onboarding.title",
    "domain.react",
    "domain.react-native",
    "domain.typescript",
    "domain.node",
    "badge.label",
    "checkpoint.xp",
    "progress.dailyGoalProgress",
    "digest.xpAwarded",
    "readiness.progress",
    "exam.score",
    "exam.domainScore",
    "certificate.id",
    "certificate.score",
];

const flatEn = flatten(en as unknown as Catalogue);
const flatEs = flatten(es as unknown as Catalogue);

afterEach(async () => {
    await changeLocale("en");
});

describe("catalogues", () => {
    it("ships one bundle per supported locale", () => {
        expect(Object.keys(resources).sort()).toEqual([...LOCALES].sort());
    });

    it("covers every English key in Spanish", () => {
        const missing = [...new Set(Object.keys(flatEn).map(baseKey))].filter(
            (key) =>
                !Object.keys(flatEs).some((entry) => baseKey(entry) === key)
        );

        expect(missing).toEqual([]);
    });

    it("carries the same interpolation placeholders in both languages", () => {
        const mismatched = Object.entries(flatEn)
            .filter(([key]) => flatEs[key] !== undefined)
            .filter(
                ([key, value]) =>
                    placeholders(value).join() !==
                    placeholders(flatEs[key]).join()
            )
            .map(([key]) => key);

        expect(mismatched).toEqual([]);
    });

    it("leaves no English copy sitting untranslated in Spanish", () => {
        const untranslated = Object.entries(flatEn)
            .filter(([key, entry]) => flatEs[key] === entry)
            .map(([key]) => key)
            .filter((key) => !INTENTIONALLY_IDENTICAL.includes(key));

        expect(untranslated).toEqual([]);
    });
});

describe("translate", () => {
    it("boots on a supported locale", () => {
        expect(i18n.isInitialized).toBe(true);
        expect(LOCALES).toContain(i18n.language);
    });

    it("interpolates parameters", () => {
        expect(translate("progress.level", {level: 4, xp: 920})).toBe(
            "Level 4 · 920 XP"
        );
    });

    it("resolves plurals through the count parameter", () => {
        expect(translate("notifications.reviewsDue.title", {count: 1})).toBe(
            "1 question due for review"
        );
        expect(translate("notifications.reviewsDue.title", {count: 7})).toBe(
            "7 questions due for review"
        );
    });

    it("nests a label whose key is itself interpolated", () => {
        expect(
            translate("badge.label", {domain: "react-native", tier: "gold"})
        ).toBe("React Native Gold");
    });

    it("renders a translation ref from the pure layer", () => {
        expect(
            translateRef({
                key: "exam.failure.domain",
                params: {domain: "node", percentage: 40, passMark: 50},
            })
        ).toBe("Node.js scored 40%, below the 50% floor");
    });

    it("switches language for every later call", async () => {
        await changeLocale("es");

        expect(translate("practice.checkAnswer")).toBe("Comprobar respuesta");
        expect(translate("notifications.reviewsDue.title", {count: 1})).toBe(
            "1 pregunta pendiente de repaso"
        );
        expect(
            translateRef({
                key: "exam.failure.domain",
                params: {domain: "node", percentage: 40, passMark: 50},
            })
        ).toBe("Node.js obtuvo 40%, por debajo del mínimo del 50%");
    });
});
