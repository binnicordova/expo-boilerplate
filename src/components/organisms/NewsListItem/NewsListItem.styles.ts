import type {UniversalStyle} from "@expo/ui";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

export const card = (backgroundColor: string): UniversalStyle => ({
    backgroundColor,
    borderRadius: RADIUS[5] * 1.5,
    padding: SPACING[4],
    width: "100%",
});
