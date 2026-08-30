import {LinearProgressIndicator} from "@expo/ui/jetpack-compose";
import {useTheme} from "@/theme/useTheme";
import {clampProgress, type ProgressBarProps} from "./ProgressBar.types";

export const ProgressBar = ({
    progress,
    color,
    trackColor,
}: ProgressBarProps) => {
    const {accent, lightness} = useTheme();

    return (
        <LinearProgressIndicator
            progress={clampProgress(progress)}
            color={color ?? accent}
            trackColor={trackColor ?? lightness}
        />
    );
};
