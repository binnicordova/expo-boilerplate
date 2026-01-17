import {View, type ViewProps} from "react-native";
import {theme} from "@/theme/colors";
import {styles} from "./ProgressBar.styles";

export type ProgressBarProps = ViewProps & {
    progress: number;
    color?: string;
};

export const ProgressBar = ({
    progress,
    color,
    style,
    ...props
}: ProgressBarProps) => {
    const {accent, lightness} = theme();

    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    return (
        <View
            style={[styles.container, {backgroundColor: lightness}, style]}
            {...props}
        >
            <View
                testID="progress-indicator"
                style={[
                    styles.progress,
                    {
                        width: `${clampedProgress * 100}%`,
                        backgroundColor: color ?? accent,
                    },
                ]}
            />
        </View>
    );
};
