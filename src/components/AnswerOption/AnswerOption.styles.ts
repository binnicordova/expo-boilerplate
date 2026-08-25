import {StyleSheet} from "react-native";
import {BORDER, RADIUS} from "@/theme/border";
import {FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

const MARKER_SIZE = 26;

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: SPACING[3],
        borderRadius: RADIUS[4],
        borderWidth: BORDER[1],
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[3],
    },
    marker: {
        width: MARKER_SIZE,
        height: MARKER_SIZE,
        borderRadius: MARKER_SIZE / 2,
        borderWidth: BORDER[1],
        alignItems: "center",
        justifyContent: "center",
    },
    markerLabel: {
        fontSize: FONT_SIZE[2] - 3,
        lineHeight: FONT_SIZE[2],
    },
    label: {
        flex: 1,
        flexShrink: 1,
    },
});
