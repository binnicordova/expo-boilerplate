import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING[2],
        paddingVertical: SPACING[1],
        borderRadius: RADIUS[5],
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 20,
    },
    text: {
        fontSize: FONT_SIZE[1],
        fontFamily: FONT_FAMILY.LATO_BOLD,
        lineHeight: 14,
    },
});
