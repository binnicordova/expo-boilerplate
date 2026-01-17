import {StyleSheet} from "react-native";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SPACING[2],
    },
    label: {
        marginLeft: SPACING[2],
        fontSize: FONT_SIZE[2],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    disabled: {
        opacity: 0.5,
    },
});
