import {StyleSheet} from "react-native";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: SPACING[4],
        width: "100%",
        minHeight: 56,
    },
    content: {
        flex: 1,
        justifyContent: "center",
    },
    leftContent: {
        marginRight: SPACING[4],
    },
    rightContent: {
        marginLeft: SPACING[4],
    },
    title: {},
    subtitle: {
        marginTop: 2,
    },
});
