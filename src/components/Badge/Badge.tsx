import {View, type ViewProps} from "react-native";
import {theme} from "@/theme/colors";
import {Text} from "../Text/Text";
import {styles} from "./Badge.styles";

export type BadgeVariant = "default" | "primary" | "error" | "success" | "info";

export type BadgeProps = ViewProps & {
    label: string | number;
    variant?: BadgeVariant;
};

export const Badge = ({
    label,
    variant = "default",
    style,
    ...props
}: BadgeProps) => {
    const {accent, error, darkness, lightness, text, background} = theme();

    const getColors = () => {
        switch (variant) {
            case "primary":
                return {bg: accent, fg: background};
            case "error":
                return {bg: error, fg: "#fff"};
            case "success":
                return {bg: darkness, fg: "#fff"};
            case "info":
                return {bg: lightness, fg: text};
            default:
                return {bg: `${text}20`, fg: text}; // 12% opacity text color for bg
        }
    };

    const {bg, fg} = getColors();

    return (
        <View
            style={[styles.container, {backgroundColor: bg}, style]}
            {...props}
        >
            <Text style={[styles.text, {color: fg}]}>{label}</Text>
        </View>
    );
};
