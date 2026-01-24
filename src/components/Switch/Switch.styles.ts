import {StyleSheet} from "react-native";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: SPACING[2],
        width: "100%",
    },
    label: {
        flex: 1,
    },
});
