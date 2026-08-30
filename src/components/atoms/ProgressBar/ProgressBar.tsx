import {StyleSheet, View} from "react-native";
import {PILL_RADIUS} from "@/theme/ui";
import {useTheme} from "@/theme/useTheme";
import {clampProgress, type ProgressBarProps} from "./ProgressBar.types";

const TRACK_HEIGHT = 6;

const styles = StyleSheet.create({
    track: {
        width: "100%",
        height: TRACK_HEIGHT,
        borderRadius: PILL_RADIUS,
        overflow: "hidden",
    },
    fill: {
        height: "100%",
        borderRadius: PILL_RADIUS,
    },
});

export const ProgressBar = ({
    progress,
    color,
    trackColor,
    testID,
}: ProgressBarProps) => {
    const {accent, lightness} = useTheme();

    return (
        <View
            testID={testID}
            style={[styles.track, {backgroundColor: trackColor ?? lightness}]}
        >
            <View
                style={[
                    styles.fill,
                    {
                        backgroundColor: color ?? accent,
                        width: `${Math.round(clampProgress(progress) * 100)}%`,
                    },
                ]}
            />
        </View>
    );
};
