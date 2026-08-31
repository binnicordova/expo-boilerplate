import * as Localization from "expo-localization";
import i18next from "i18next";
import {useCallback} from "react";
import {
    initReactI18next,
    useTranslation as useI18nextTranslation,
} from "react-i18next";
import {DEFAULT_LOCALE, LOCALES, type Locale} from "@/constants/locales";
import {resolveLocale} from "@/utils/locale";
import {en} from "./locales/en";
import {es} from "./locales/es";
import type {TranslationKey, TranslationParams, TranslationRef} from "./types";

export type {TranslationKey, TranslationParams, TranslationRef};

export const resources = {
    en: {translation: en},
    es: {translation: es},
} satisfies Record<Locale, {translation: unknown}>;

/**
 * Ordered most-preferred first, which is exactly what `resolveLocale` walks.
 * Guarded because the module is unavailable outside a native runtime.
 */
export const getDeviceLocales = (): string[] => {
    try {
        return Localization.getLocales().map((locale) => locale.languageTag);
    } catch (_error) {
        return [];
    }
};

if (!i18next.isInitialized) {
    void i18next.use(initReactI18next).init({
        resources,
        lng: resolveLocale(getDeviceLocales()),
        fallbackLng: DEFAULT_LOCALE,
        supportedLngs: [...LOCALES],
        defaultNS: "translation",
        interpolation: {escapeValue: false},
        returnNull: false,
    });
}

export const i18n = i18next;

export const getLocale = (): Locale =>
    resolveLocale([i18next.resolvedLanguage, i18next.language]);

export const changeLocale = async (locale: Locale): Promise<void> => {
    if (getLocale() === locale) {
        return;
    }

    await i18next.changeLanguage(locale);
};

/**
 * The module-scope translator, for the layers that have no React context —
 * stores, services and the notification scheduler.
 */
export const translate = (
    key: TranslationKey,
    params?: TranslationParams
): string => i18next.t(key, {...params});

export const translateRef = (ref: TranslationRef): string =>
    translate(ref.key, ref.params);

/**
 * Same contract as `translate`, but re-renders the caller when the locale
 * changes.
 */
export const useTranslation = () => {
    const {t: translator, i18n: instance} = useI18nextTranslation();

    const t = useCallback(
        (key: TranslationKey, params?: TranslationParams): string =>
            translator(key, {...params}),
        [translator]
    );

    const tRef = useCallback(
        (ref: TranslationRef): string => t(ref.key, ref.params),
        [t]
    );

    return {t, tRef, locale: resolveLocale([instance.resolvedLanguage])};
};
