import type {Translation} from "./locales/en";

type PluralSuffix = "_zero" | "_one" | "_two" | "_few" | "_many" | "_other";

/**
 * i18next stores plurals as sibling keys (`title_one`, `title_other`) but is
 * called with the base key plus a `count`. The key union has to collapse them
 * back or every plural string becomes uncallable.
 */
type StripPlural<K extends string> = K extends `${infer Base}${PluralSuffix}`
    ? Base
    : K;

type Leaves<T, Prefix extends string = ""> = {
    [K in Extract<keyof T, string>]: T[K] extends string
        ? `${Prefix}${StripPlural<K>}`
        : Leaves<T[K], `${Prefix}${K}.`>;
}[Extract<keyof T, string>];

export type TranslationKey = Leaves<Translation>;

export type TranslationParams = Record<string, string | number>;

/**
 * What the pure layer emits instead of copy: a key plus its data, translated
 * at the edge. Keeping the logic locale-free is what lets a notification
 * planned in English be delivered in Spanish.
 */
export type TranslationRef = {
    key: TranslationKey;
    params?: TranslationParams;
};
