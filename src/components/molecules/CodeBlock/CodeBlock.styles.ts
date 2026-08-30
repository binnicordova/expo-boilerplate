import type {UniversalStyle} from "@expo/ui";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

export const container = (backgroundColor: string): UniversalStyle => ({
    backgroundColor,
    borderRadius: RADIUS[5],
    padding: SPACING[3],
    width: "100%",
});
