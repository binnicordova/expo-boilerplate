import type {UniversalStyle} from "@expo/ui";
import {RADIUS} from "./border";
import {SPACING} from "./spacing";

export const PILL_RADIUS = 999;

export const card = (
    backgroundColor: string,
    borderColor: string
): UniversalStyle => ({
    backgroundColor,
    borderColor,
    borderWidth: 1,
    borderRadius: RADIUS[5] * 2,
    padding: SPACING[4],
});

export const pill = (
    borderColor: string,
    backgroundColor?: string
): UniversalStyle => ({
    backgroundColor,
    borderColor,
    borderWidth: 1,
    borderRadius: PILL_RADIUS,
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[1],
});

export const surface = (backgroundColor: string): UniversalStyle => ({
    backgroundColor,
    borderRadius: RADIUS[5],
    padding: SPACING[3],
});
