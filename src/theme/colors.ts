type ThemeType = "light" | "dark";

type ColorScheme = {
    background: string;
    text: string;
    accent: string;
    error: string;
    lightness: string;
    darkness: string;
};

const Colors: Record<ThemeType, ColorScheme> = {
    // Light theme: cool, professional, trustworthy blues and deep navy text
    light: {
        background: "#F7FBFF", // very light cool background for clarity
        text: "#062743", // deep navy for high readability and credibility
        accent: "#2563EB", // trustworthy, modern blue accent (interactive)
        error: "#C62828", // clear, accessible error red
        lightness: "#EAF4FF", // subtle blue tint for cards and surfaces
        darkness: "#062743", // consistent heading / strong text color
    },

    // Dark theme: deep slate background with vivid indigo accent for a modern AI feel
    dark: {
        background: "#071226", // near-black navy for legibility and depth
        text: "#E6F5FF", // soft, slightly cool off-white for reduced glare
        accent: "#7C3AED", // vivid indigo-purple for a contemporary, AI-forward accent
        error: "#FF6B6B", // high-visibility error color on dark surfaces
        lightness: "#0B1220", // card surface, slightly lifted from background
        darkness: "#BFE9FF", // pale sky-blue for strong headings on dark cards
    },
};

export const theme = (theme?: ThemeType): ColorScheme => {
    return Colors[theme || "light"];
};
