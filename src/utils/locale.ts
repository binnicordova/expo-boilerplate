import {
    DEFAULT_LOCALE,
    LOCALES,
    type Locale,
    type LocalePreference,
    SYSTEM_LOCALE,
} from "@/constants/locales";

const baseLanguage = (tag: string) =>
    tag.toLowerCase().replace("_", "-").split("-")[0];

export const isLocale = (value: unknown): value is Locale =>
    typeof value === "string" && LOCALES.includes(value as Locale);

export const isLocalePreference = (value: unknown): value is LocalePreference =>
    value === SYSTEM_LOCALE || isLocale(value);

/**
 * Walks the device's ordered language list and returns the first tag the app
 * ships. Regional variants collapse onto their base language, so `es-419` and
 * `es-MX` both resolve to `es`.
 */
export const resolveLocale = (
    candidates: readonly (string | null | undefined)[],
    supported: readonly Locale[] = LOCALES,
    fallback: Locale = DEFAULT_LOCALE
): Locale => {
    for (const candidate of candidates) {
        if (!candidate) {
            continue;
        }

        const language = baseLanguage(candidate);
        const match = supported.find((locale) => locale === language);

        if (match) {
            return match;
        }
    }

    return fallback;
};

/**
 * An explicit choice always wins; `system` defers to the device list, which is
 * what makes "follow the phone" survive the user changing it later.
 */
export const resolvePreferredLocale = (
    preference: LocalePreference,
    deviceLocales: readonly (string | null | undefined)[],
    supported: readonly Locale[] = LOCALES,
    fallback: Locale = DEFAULT_LOCALE
): Locale =>
    preference === SYSTEM_LOCALE
        ? resolveLocale(deviceLocales, supported, fallback)
        : preference;
