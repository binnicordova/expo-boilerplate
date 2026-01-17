import {TouchableOpacity, type TouchableOpacityProps} from "react-native";
import {theme} from "@/theme/colors";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./Chip.styles";

export type ChipProps = TouchableOpacityProps & {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    onClose?: () => void;
    icon?: string;
};

export const Chip = ({
    label,
    selected,
    onPress,
    onClose,
    icon,
    style,
    ...props
}: ChipProps) => {
    const {accent, text, background, lightness} = theme();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: selected ? accent : background,
                    borderColor: selected ? accent : lightness,
                },
                style,
            ]}
            {...props}
        >
            {icon && (
                <Icon
                    name={icon as React.ComponentProps<typeof Icon>["name"]}
                    size={16}
                    color={selected ? background : text}
                    style={styles.icon}
                />
            )}
            <Text style={[styles.label, {color: selected ? background : text}]}>
                {label}
            </Text>
            {onClose && (
                <TouchableOpacity
                    onPress={onClose}
                    hitSlop={10}
                    testID="chip-close-button"
                >
                    <Icon
                        name="close-circle"
                        size={16}
                        color={selected ? background : text}
                        style={styles.closeIcon}
                    />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};
