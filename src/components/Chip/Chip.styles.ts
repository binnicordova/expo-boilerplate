import {StyleSheet} from "react-native";
import {BORDER, RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[1],
        borderRadius: RADIUS[5],
        alignSelf: "flex-start",
        borderWidth: BORDER[1],
    },
    label: {
        fontSize: FONT_SIZE[2],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    icon: {
        marginRight: SPACING[1],
    },
    closeIcon: {
        marginLeft: SPACING[1],
    },
});
