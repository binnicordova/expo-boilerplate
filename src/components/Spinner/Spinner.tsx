import {ActivityIndicator, type ActivityIndicatorProps} from "react-native";
import {theme} from "@/theme/colors";

export type SpinnerProps = ActivityIndicatorProps & {
    color?: string;
};

export const Spinner = ({size = "small", color, ...props}: SpinnerProps) => {
    const {accent} = theme();

    return (
        <ActivityIndicator
            testID="spinner"
            size={size}
            color={color ?? accent}
            {...props}
        />
    );
};
