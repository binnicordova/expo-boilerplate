import type {ReactNode} from "react";
import {View, type ViewProps} from "react-native";
import {theme} from "@/theme/colors";
import {styles} from "./Card.styles";

export type CardProps = ViewProps & {
    children: ReactNode;
    withShadow?: boolean;
};

export const Card = ({
    children,
    withShadow = true,
    style,
    ...props
}: CardProps) => {
    const {background, lightness} = theme();

    return (
        <View
            {...props}
            style={[
                styles.container,
                {
                    backgroundColor: background,
                    borderColor: lightness,
                },
                withShadow && styles.elevation,
                style,
            ]}
        >
            {children}
        </View>
    );
};
