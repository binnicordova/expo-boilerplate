import {StyleSheet} from "react-native";
import {SHADOW} from "@/theme/shadow";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginVertical: SPACING[2],
        marginHorizontal: SPACING[4],
        padding: SPACING[4],
        ...SHADOW.small,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 4,
    },
    comment: {
        fontSize: 15,
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    metaText: {
        fontSize: 13,
    },
    chevronContainer: {
        marginLeft: 12,
        justifyContent: "center",
        alignItems: "center",
    },
});
