import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 8,
        borderRadius: RADIUS[5],
        overflow: "hidden",
        marginVertical: SPACING[2],
    },
    progress: {
        height: "100%",
        borderRadius: RADIUS[5],
    },
});
