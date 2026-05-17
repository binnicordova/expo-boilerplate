import type {ReactNode} from "react";
import {useState} from "react";
import {
    Pressable,
    type PressableProps,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import {isTV} from "@/constants/platform";

export type TouchableWrapperProps = Omit<PressableProps, "style"> & {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    focusedStyle?: StyleProp<ViewStyle>;
};

export const TouchableWrapper = ({
    children,
    focusedStyle,
    onFocus,
    onBlur,
    style,
    ...props
}: TouchableWrapperProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Pressable
            {...props}
            onFocus={(event) => {
                if (isTV) setIsFocused(true);
                onFocus?.(event);
            }}
            onBlur={(event) => {
                if (isTV) setIsFocused(false);
                onBlur?.(event);
            }}
            style={[style, isTV && isFocused && focusedStyle]}
            {...(isTV && {
                tvParallaxProperties: {
                    enabled: false,
                },
            })}
        >
            {children}
        </Pressable>
    );
};
