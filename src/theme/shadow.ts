export const SHADOW = {
    none: {
        shadowColor: "transparent",
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    small: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    large: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    extraLarge: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
};

export type ShadowType = keyof typeof SHADOW;

export const SHADOW_LEVELS = [
    SHADOW.none,
    SHADOW.small,
    SHADOW.medium,
    SHADOW.large,
    SHADOW.extraLarge,
];
