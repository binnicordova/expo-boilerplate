export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const SYSTEM_LOCALE = "system" as const;

export type LocalePreference = Locale | typeof SYSTEM_LOCALE;

/**
 * Autonyms: a language is always offered in its own language, never
 * translated, so a reader who cannot read the current locale can still find
 * their own.
 */
export const LOCALE_AUTONYM: Record<Locale, string> = {
    en: "English",
    es: "Español",
};
