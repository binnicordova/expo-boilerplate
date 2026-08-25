import {StyleSheet} from "react-native";
import {BORDER, RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS[4],
        borderWidth: BORDER[1],
        padding: SPACING[3],
        gap: SPACING[2],
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
    },
    title: {
        flex: 1,
        flexShrink: 1,
    },
});
