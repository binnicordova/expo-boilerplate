import {View, type ViewProps} from "react-native";
import {theme} from "@/theme/colors";
import {Text} from "../Text/Text";
import {TouchableWrapper} from "../TouchableWrapper/TouchableWrapper";
import {styles} from "./Radio.styles";

export type RadioButtonProps = {
    selected: boolean;
    onPress: () => void;
    label?: string;
    disabled?: boolean;
    style?: ViewProps["style"];
};

export const RadioButton = ({
    selected,
    onPress,
    label,
    disabled = false,
    style,
}: RadioButtonProps) => {
    const {accent, text} = theme();

    return (
        <TouchableWrapper
            onPress={onPress}
            disabled={disabled}
            style={[styles.container, disabled && styles.disabled, style]}
        >
            <View
                style={[
                    styles.outerCircle,
                    {borderColor: selected ? accent : text},
                ]}
            >
                {selected && (
                    <View
                        style={[styles.innerCircle, {backgroundColor: accent}]}
                    />
                )}
            </View>
            {label && (
                <Text style={[styles.label, {color: text}]}>{label}</Text>
            )}
        </TouchableWrapper>
    );
};

export type RadioGroupProps<T> = {
    options: {label: string; value: T}[];
    selectedValue: T;
    onValueChange: (value: T) => void;
    disabled?: boolean;
    style?: ViewProps["style"];
};

export function RadioGroup<T>({
    options,
    selectedValue,
    onValueChange,
    disabled = false,
    style,
}: RadioGroupProps<T>) {
    return (
        <View style={[styles.groupContainer, style]}>
            {options.map((option) => (
                <RadioButton
                    key={String(option.value)}
                    label={option.label}
                    selected={selectedValue === option.value}
                    onPress={() => onValueChange(option.value)}
                    disabled={disabled}
                />
            ))}
        </View>
    );
}
