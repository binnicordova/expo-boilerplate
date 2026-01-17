import {StyleSheet} from "react-native";
import {BORDER, RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: SPACING[4],
    },
    label: {
        fontSize: FONT_SIZE[2],
        fontFamily: FONT_FAMILY.LATO_BOLD,
        marginBottom: SPACING[2],
    },
    input: {
        height: 48,
        borderWidth: BORDER[1],
        borderRadius: RADIUS[2],
        paddingHorizontal: SPACING[4],
        fontSize: FONT_SIZE[2],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    errorInput: {
        borderColor: "red", // Will be overridden by theme error color
    },
    errorText: {
        fontSize: FONT_SIZE[1],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        marginTop: SPACING[1],
    },
});
