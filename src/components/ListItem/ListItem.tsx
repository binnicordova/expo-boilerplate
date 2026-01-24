import type {ReactNode} from "react";
import {TouchableOpacity, View, type ViewProps} from "react-native";
import {theme} from "@/theme/colors";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./ListItem.styles";

export type ListItemProps = {
    title: string;
    subtitle?: string;
    left?: ReactNode;
    right?: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    style?: ViewProps["style"];
};

export const ListItem = ({
    title,
    subtitle,
    left,
    right,
    onPress,
    disabled = false,
    style,
}: ListItemProps) => {
    const {background} = theme();

    return (
        <TouchableOpacity
            activeOpacity={onPress ? 0.7 : 1}
            onPress={onPress}
            disabled={disabled || !onPress}
            style={[styles.container, {backgroundColor: background}, style]}
        >
            {left && <View style={styles.leftContent}>{left}</View>}

            <View style={styles.content}>
                <Text type="label" style={styles.title}>
                    {title}
                </Text>
                {subtitle && (
                    <Text type="caption" style={styles.subtitle}>
                        {subtitle}
                    </Text>
                )}
            </View>

            {right && <View style={styles.rightContent}>{right}</View>}
            {onPress && !right && (
                <View style={styles.rightContent}>
                    <Icon name="chevron-right" size={20} />
                </View>
            )}
        </TouchableOpacity>
    );
};
