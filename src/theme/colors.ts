type ThemeType = "light" | "dark";

type ColorScheme = {
    background: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    onAccent: string;
    error: string;
    errorSurface: string;
    success: string;
    successSurface: string;
    lightness: string;
    darkness: string;
};

/**
 * Derived from the app icon: a deep indigo ground under a magenta → violet →
 * orange gradient. Violet carries every interactive affordance; magenta-leaning
 * red and a teal-green sit either side of it without muddying the brand hue.
 */
const Colors: Record<ThemeType, ColorScheme> = {
    light: {
        background: "#F7F6FC", // lavender-tinted page ground
        surface: "#FFFFFF", // raised cards
        text: "#2A2A45", // body copy
        muted: "#6E6E8F", // secondary copy and inactive glyphs
        accent: "#7C3AED", // the icon's core violet — every tappable thing
        onAccent: "#FFFFFF", // copy sitting on an accent fill
        error: "#E11D48",
        errorSurface: "#FDECF1",
        success: "#12805C",
        successSurface: "#E4F5EF",
        lightness: "#EFEBFD", // subtle violet fill for options and pills
        darkness: "#171730", // headings, matching the icon's ground
    },

    dark: {
        background: "#12122A", // the icon's own indigo ground
        surface: "#1C1C38", // raised cards, lifted off the ground
        text: "#E6E4F5",
        muted: "#9C9CC0",
        accent: "#A78BFA", // violet lightened to stay legible on indigo
        onAccent: "#12122A", // the ground colour reads darkest on light violet
        error: "#FF6B8A",
        errorSurface: "#3A1A28",
        success: "#3DD9A0",
        successSurface: "#12332B",
        lightness: "#262649",
        darkness: "#FFFFFF",
    },
};

export const theme = (theme?: ThemeType): ColorScheme => {
    return Colors[theme || "light"];
};

export type {ColorScheme, ThemeType};
