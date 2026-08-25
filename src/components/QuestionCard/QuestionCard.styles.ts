import {StyleSheet} from "react-native";
import {BORDER, RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS[5],
        borderWidth: BORDER[1],
        padding: SPACING[4],
        gap: SPACING[3],
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
    },
    metaLabel: {
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    scenario: {
        borderLeftWidth: BORDER[2],
        paddingLeft: SPACING[3],
    },
    hint: {
        fontStyle: "italic",
    },
    options: {
        gap: SPACING[2],
    },
});
