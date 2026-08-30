import type {UniversalStyle} from "@expo/ui";
import {SPACING} from "@/theme/spacing";

export const scenario = (borderColor: string): UniversalStyle => ({
    borderColor,
    borderWidth: 1,
    borderRadius: SPACING[1],
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    width: "100%",
});

export const optionList: UniversalStyle = {
    width: "100%",
};
