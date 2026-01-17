import {TouchableOpacity, type TouchableOpacityProps} from "react-native";
import {theme} from "@/theme/colors";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./Checkbox.styles";

export type CheckboxProps = TouchableOpacityProps & {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
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
        <TouchableOpacity
            activeOpacity={0.7}
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
        </TouchableOpacity>
    );
};
