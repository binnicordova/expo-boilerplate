import {StyleSheet} from "react-native";
import {BORDER, RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS[5],
        borderWidth: BORDER[2],
        padding: SPACING[4],
        gap: SPACING[3],
        alignItems: "center",
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    stat: {
        alignItems: "center",
        gap: SPACING[1],
    },
    statLabel: {
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    actions: {
        width: "100%",
        gap: SPACING[2],
    },
    headline: {
        textAlign: "center",
    },
});
