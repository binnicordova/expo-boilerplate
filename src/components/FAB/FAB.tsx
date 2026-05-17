import type {PressableProps, StyleProp, ViewStyle} from "react-native";
import {theme} from "@/theme/colors";
import {SHADOW} from "@/theme/shadow";
import {Icon, type IconName} from "../Icon/Icon";
import {TouchableWrapper} from "../TouchableWrapper/TouchableWrapper";
import {styles} from "./FAB.styles";

export type FABProps = Omit<PressableProps, "style"> & {
    icon: IconName;
    onPress: () => void;
    color?: string;
    backgroundColor?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
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
        <TouchableWrapper
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
        </TouchableWrapper>
    );
};
