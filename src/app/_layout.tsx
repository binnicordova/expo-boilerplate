import {useFonts} from "expo-font";
import {Slot} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";
import {getDefaultStore, Provider} from "jotai";
import {useEffect} from "react";
import {StyleSheet} from "react-native";
import {
    initialWindowMetrics,
    SafeAreaProvider,
    SafeAreaView,
} from "react-native-safe-area-context";
import {useEngagementSync} from "@/hooks/useEngagementSync";
import {useLocaleSync} from "@/hooks/useLocaleSync";
import {useTheme} from "@/theme/useTheme";

SplashScreen.preventAutoHideAsync();

const FONT_SETTINGS = {
    MaterialCommunityIcons: require("../../assets/fonts/MaterialCommunityIcons.ttf"),
    LatoLight: require("../../assets/fonts/Lato-Light.ttf"),
    LatoRegular: require("../../assets/fonts/Lato-Regular.ttf"),
    LatoBold: require("../../assets/fonts/Lato-Bold.ttf"),
};

const styles = StyleSheet.create({
    baseLayer: {
        flex: 1,
    },
});

const EngagementBridge = () => {
    useEngagementSync();
    return null;
};

const LocaleBridge = () => {
    useLocaleSync();
    return null;
};

const RootLayout = () => {
    const {background} = useTheme();
    const [fontsLoaded, fontError] = useFonts(FONT_SETTINGS);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <Provider store={getDefaultStore()}>
                <SafeAreaView
                    style={[styles.baseLayer, {backgroundColor: background}]}
                >
                    <StatusBar style="auto" />
                    <LocaleBridge />
                    <EngagementBridge />
                    <Slot />
                </SafeAreaView>
            </Provider>
        </SafeAreaProvider>
    );
};

let AppEntryPoint = RootLayout;

if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true") {
    console.log("🎨 Storybook mode enabled");
    try {
        AppEntryPoint = require("../../.rnstorybook").default;
        SplashScreen.hideAsync();
    } catch (error) {
        console.warn("Storybook not available:", error);
    }
}

export default AppEntryPoint;
