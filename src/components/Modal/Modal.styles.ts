import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: SPACING[6],
    },
    content: {
        borderRadius: RADIUS[5],
        overflow: "hidden",
    },
    header: {
        padding: SPACING[4],
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(0,0,0,0.1)",
    },
    title: {
        textAlign: "center",
    },
    body: {
        padding: SPACING[4],
    },
    footer: {
        padding: SPACING[4],
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "rgba(0,0,0,0.1)",
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: SPACING[2],
    },
});
