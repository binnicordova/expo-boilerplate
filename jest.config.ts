/** @jest-config-loader ts-node */
// or
/** @jest-config-loader esbuild-register */

import type {Config} from "jest";

const config: Config = {
    preset: "jest-expo",
    verbose: true,
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@testing-library|chalk|ansi-styles)",
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{ts,tsx,js,jsx}",
        "!**/coverage/**",
        "!**/node_modules/**",
        "!**/babel.config.js",
        "!**/expo-env.d.ts",
        "!**/.expo/**",
    ],
    coverageThreshold: {
        global: {
            branches: 5,
            functions: 5,
            lines: 5,
            statements: 5,
        },
    },
};

export default config;
