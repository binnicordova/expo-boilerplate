import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS[5],
        borderWidth: StyleSheet.hairlineWidth,
        overflow: "hidden",
        marginBottom: SPACING[2],
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: SPACING[4],
    },
    content: {
        padding: SPACING[4],
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "rgba(0,0,0,0.05)",
    },
});
