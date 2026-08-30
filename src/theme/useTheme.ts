import {useColorScheme} from "react-native";
import {type ColorScheme, theme} from "./colors";

/**
 * Resolves the palette against the system appearance. Every component reads
 * colours through this so light and dark stay in step with the device.
 */
export const useTheme = (): ColorScheme => {
    const scheme = useColorScheme();

    return theme(scheme === "dark" ? "dark" : "light");
};
