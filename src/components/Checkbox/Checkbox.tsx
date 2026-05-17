import type {PressableProps, StyleProp, ViewStyle} from "react-native";
import {theme} from "@/theme/colors";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {TouchableWrapper} from "../TouchableWrapper/TouchableWrapper";
import {styles} from "./Checkbox.styles";

export type CheckboxProps = Omit<PressableProps, "style"> & {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};

export const Checkbox = ({
    checked,
    onChange,
    label,
    disabled = false,
    style,
    ...props
}: CheckboxProps) => {
    const {accent, text} = theme();

    const handlePress = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    return (
        <TouchableWrapper
            onPress={handlePress}
            disabled={disabled}
            style={[styles.container, disabled && styles.disabled, style]}
            {...props}
        >
            <Icon
                name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
                size={24}
                color={checked ? accent : text}
            />
            {label && (
                <Text style={[styles.label, {color: text}]}>{label}</Text>
            )}
        </TouchableWrapper>
    );
};
