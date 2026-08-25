import {StyleSheet} from "react-native";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: SPACING[4],
        paddingTop: SPACING[3],
        gap: SPACING[4],
    },
    centered: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: SPACING[3],
        paddingHorizontal: SPACING[4],
    },
});
