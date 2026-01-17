import {
    Switch as RNSwitch,
    type SwitchProps as RNSwitchProps,
    View,
} from "react-native";
import {theme} from "@/theme/colors";
import {Text} from "../Text/Text";
import {styles} from "./Switch.styles";

export type SwitchProps = RNSwitchProps & {
    label?: string;
};

export const Switch = ({
    label,
    value,
    onValueChange,
    disabled,
    style,
    ...props
}: SwitchProps) => {
    const {accent, lightness} = theme();

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text type="label" style={styles.label}>
                    {label}
                </Text>
            )}
            <RNSwitch
                {...props}
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                trackColor={{false: lightness, true: accent}}
                thumbColor={value ? "#fff" : "#f4f3f4"}
                ios_backgroundColor={lightness}
            />
        </View>
    );
};
