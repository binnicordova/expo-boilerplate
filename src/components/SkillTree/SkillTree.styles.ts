import {StyleSheet} from "react-native";
import {BORDER, RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

const TRACK_HEIGHT = 4;

export const styles = StyleSheet.create({
    container: {
        gap: SPACING[2],
    },
    node: {
        borderRadius: RADIUS[4],
        borderWidth: BORDER[1],
        padding: SPACING[3],
        gap: SPACING[2],
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: SPACING[2],
    },
    label: {
        flex: 1,
        flexShrink: 1,
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
    requirement: {
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
});
