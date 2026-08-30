import type {ReactNode} from "react";
import {Surface} from "@/components/atoms/Surface/Surface";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";

export type CardProps = {
    children: ReactNode;
    borderColor?: string;
    backgroundColor?: string;
    spacing?: number;
    alignment?: "start" | "center" | "end";
    opacity?: number;
    testID?: string;
};

export const Card = ({
    children,
    borderColor,
    backgroundColor,
    spacing = SPACING[3],
    alignment = "start",
    opacity,
    testID,
}: CardProps) => {
    const {lightness, surface} = useTheme();

    return (
        <Surface
            testID={testID}
            fill
            spacing={spacing}
            alignment={alignment}
            padding={SPACING[4]}
            radius={RADIUS[5] * 2}
            backgroundColor={backgroundColor ?? surface}
            borderColor={borderColor ?? lightness}
            borderWidth={1}
            elevation={6}
            opacity={opacity}
        >
            {children}
        </Surface>
    );
};
