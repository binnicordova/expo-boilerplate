import {Image, View, type ViewProps} from "react-native";
import {theme} from "@/theme/colors";
import {Text} from "../Text/Text";
import {styles} from "./Avatar.styles";

export type AvatarProps = ViewProps & {
    uri?: string;
    name?: string;
    size?: number;
    variant?: "circle" | "rounded";
};

export const Avatar = ({
    uri,
    name,
    size = 40,
    variant = "circle",
    style,
    ...props
}: AvatarProps) => {
    const {lightness, text} = theme();

    const getInitials = (name?: string) => {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const containerStyle = [
        styles.container,
        variant === "circle" ? styles.circle : styles.rounded,
        {width: size, height: size, backgroundColor: lightness},
        style,
    ];

    const initialsSize = size * 0.4;

    return (
        <View style={containerStyle} {...props}>
            {uri ? (
                <Image
                    source={{uri}}
                    style={styles.image}
                    accessibilityRole="image"
                    testID="avatar-image"
                />
            ) : (
                <Text
                    style={[
                        styles.initials,
                        {fontSize: initialsSize, color: text},
                    ]}
                >
                    {getInitials(name)}
                </Text>
            )}
        </View>
    );
};
