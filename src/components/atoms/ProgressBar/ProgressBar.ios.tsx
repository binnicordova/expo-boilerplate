import {ProgressView} from "@expo/ui/swift-ui";
import {Animation, animation, tint} from "@expo/ui/swift-ui/modifiers";
import {useTheme} from "@/theme/useTheme";
import {clampProgress, type ProgressBarProps} from "./ProgressBar.types";

export const ProgressBar = ({progress, color, testID}: ProgressBarProps) => {
    const {accent} = useTheme();
    const value = clampProgress(progress);

    return (
        <ProgressView
            testID={testID}
            value={value}
            modifiers={[
                tint(color ?? accent),
                animation(
                    Animation.spring({response: 0.45, dampingFraction: 0.9}),
                    value
                ),
            ]}
        />
    );
};
