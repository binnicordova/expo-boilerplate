import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

const TRACK_HEIGHT = 8;

export const styles = StyleSheet.create({
    container: {
        gap: SPACING[2],
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    track: {
        height: TRACK_HEIGHT,
        borderRadius: RADIUS[5],
        overflow: "hidden",
    },
    fill: {
        height: "100%",
        borderRadius: RADIUS[5],
    },
});
