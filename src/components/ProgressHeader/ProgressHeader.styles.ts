import {StyleSheet} from "react-native";
import {BORDER, RADIUS} from "@/theme/border";
import {FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

const TRACK_HEIGHT = 6;

export const styles = StyleSheet.create({
    container: {
        gap: SPACING[2],
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: SPACING[2],
    },
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[1],
        borderRadius: RADIUS[5],
        borderWidth: BORDER[1],
        paddingHorizontal: SPACING[2],
        paddingVertical: SPACING[1],
    },
    pillLabel: {
        fontSize: FONT_SIZE[2] - 3,
    },
    track: {
        height: TRACK_HEIGHT,
        borderRadius: TRACK_HEIGHT / 2,
        overflow: "hidden",
    },
    fill: {
        height: "100%",
        borderRadius: TRACK_HEIGHT / 2,
    },
    badges: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SPACING[1],
    },
});
