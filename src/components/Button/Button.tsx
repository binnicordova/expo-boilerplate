import {
    type PressableProps,
    type StyleProp,
    Text,
    type ViewStyle,
} from "react-native";
import {theme} from "@/theme/colors";
import {TouchableWrapper} from "../TouchableWrapper/TouchableWrapper";
import {styles} from "./Button.styles";

export type ButtonProps = Omit<PressableProps, "style"> & {
    title: string;
    style?: StyleProp<ViewStyle>;
    textColor?: string;
};

export const Button = ({
    title,
    onPress,
    disabled,
    style,
    textColor,
    ...props
}: ButtonProps) => {
    const {background: color, accent: backgroundColor} = theme();
    return (
        <TouchableWrapper
            {...props}
            style={[
                styles.container,
                {backgroundColor},
                disabled && styles.disabled,
                style,
            ]}
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
        >
            <Text style={[styles.text, {color: textColor ?? color}]}>
                {title}
            </Text>
        </TouchableWrapper>
    );
};
