import {atom} from "jotai";
import {atomWithStorage, unwrap} from "jotai/utils";
import {
    type Locale,
    type LocalePreference,
    SYSTEM_LOCALE,
} from "@/constants/locales";
import {STORAGE_ID} from "@/constants/storage";
import {changeLocale, getDeviceLocales} from "@/i18n";
import {resolvePreferredLocale} from "@/utils/locale";
import {storage} from "@/utils/storage";

export const localePreferenceAtom = atomWithStorage<LocalePreference>(
    STORAGE_ID.locale,
    SYSTEM_LOCALE,
    storage
);

export const localePreferenceValueAtom = unwrap(
    localePreferenceAtom,
    (previous) => previous ?? SYSTEM_LOCALE
);

export const localeAtom = atom<Locale>((get) =>
    resolvePreferredLocale(get(localePreferenceValueAtom), getDeviceLocales())
);

export const setLocalePreferenceAtom = atom(
    null,
    async (_get, set, preference: LocalePreference) => {
        await set(localePreferenceAtom, preference);
        await changeLocale(
            resolvePreferredLocale(preference, getDeviceLocales())
        );
    }
);
