import {StyleSheet} from "react-native";
import {BORDER, RADIUS} from "@/theme/border";
import {SHADOW} from "@/theme/shadow";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS[3],
        padding: SPACING[4],
        borderWidth: BORDER[1],
        width: "100%",
    },
    elevation: SHADOW.medium,
});
