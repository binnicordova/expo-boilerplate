import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY} from "@/theme/fonts";

export const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    initials: {
        fontFamily: FONT_FAMILY.LATO_BOLD,
        textAlign: "center",
    },
    circle: {
        borderRadius: 9999,
    },
    rounded: {
        borderRadius: RADIUS[2],
    },
});
