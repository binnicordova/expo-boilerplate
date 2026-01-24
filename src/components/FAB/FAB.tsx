import {TouchableOpacity, type TouchableOpacityProps} from "react-native";
import {theme} from "@/theme/colors";
import {SHADOW} from "@/theme/shadow";
import {Icon, type IconName} from "../Icon/Icon";
import {styles} from "./FAB.styles";

export type FABProps = TouchableOpacityProps & {
    icon: IconName;
    onPress: () => void;
    color?: string;
    backgroundColor?: string;
    size?: number;
};

export const FAB = ({
    icon,
    onPress,
    color,
    backgroundColor,
    size = 56,
    style,
    ...props
}: FABProps) => {
    const {accent, background} = theme();

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: backgroundColor ?? accent,
                    ...SHADOW.large,
                },
                style,
            ]}
            {...props}
        >
            <Icon name={icon} size={size * 0.4} color={color ?? background} />
        </TouchableOpacity>
    );
};
