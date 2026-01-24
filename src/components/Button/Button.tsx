import {Text, TouchableOpacity, type TouchableOpacityProps} from "react-native";
import {theme} from "@/theme/colors";
import {styles} from "./Button.styles";

export type ButtonProps = TouchableOpacityProps & {
    title: string;
};

export const Button = ({
    title,
    onPress,
    disabled,
    style,
    ...props
}: ButtonProps) => {
    const {background: color, accent: backgroundColor} = theme();
    return (
        <TouchableOpacity
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
            <Text style={[styles.text, {color}]}>{title}</Text>
        </TouchableOpacity>
    );
};
