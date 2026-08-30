import type {UniversalTextStyle} from "@expo/ui";
import {FONT_FAMILY} from "./fonts";

export const TEXT_ROLE = {
    title: {
        fontFamily: FONT_FAMILY.LATO_BOLD,
        fontSize: 28,
        fontWeight: "700",
        lineHeight: 34,
    },
    subtitle: {
        fontFamily: FONT_FAMILY.LATO_BOLD,
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 25,
    },
    default: {
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        fontSize: 17,
        lineHeight: 22,
    },
    link: {
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        fontSize: 17,
        lineHeight: 22,
    },
    error: {
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        fontSize: 17,
        lineHeight: 22,
    },
    label: {
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        fontSize: 15,
        lineHeight: 20,
    },
    caption: {
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        fontSize: 13,
        lineHeight: 18,
    },
} as const satisfies Record<string, UniversalTextStyle>;

export type TextType = keyof typeof TEXT_ROLE;

export const ICON_SIZE = {
    small: 15,
    medium: 20,
    large: 24,
} as const;
