import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {CODE_FONT_SIZE, CODE_LINE_HEIGHT, FONT_FAMILY} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS[4],
        paddingVertical: SPACING[3],
    },
    scroll: {
        paddingHorizontal: SPACING[3],
    },
    source: {
        fontFamily: FONT_FAMILY.MONOSPACE,
        fontSize: CODE_FONT_SIZE,
        lineHeight: CODE_LINE_HEIGHT,
    },
    caption: {
        paddingHorizontal: SPACING[3],
        paddingBottom: SPACING[2],
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
});
