import {StyleSheet} from "react-native";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SPACING[2],
    },
    outerCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    innerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
    },
    label: {
        marginLeft: SPACING[2],
        fontSize: FONT_SIZE[2],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    groupContainer: {
        width: "100%",
    },
    disabled: {
        opacity: 0.5,
    },
});
