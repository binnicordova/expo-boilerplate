import {Platform} from "react-native";

export const FONT_SIZE = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80];

export const FONT_FAMILY = {
    LATO_LIGHT: "LatoLight",
    LATO_REGULAR: "LatoRegular",
    LATO_BOLD: "LatoBold",
    MONOSPACE: Platform.select({
        ios: "Menlo",
        android: "monospace",
        default: "monospace",
    }),
};

export const LINE_HEIGHT = [0, 10, 20, 30];

export const CODE_FONT_SIZE = 13;
export const CODE_LINE_HEIGHT = 20;
