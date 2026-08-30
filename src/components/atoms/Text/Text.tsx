import {Text as UIText, type UniversalStyle} from "@expo/ui";
import {OPACITY} from "@/theme/opcacity";
import {useTheme} from "@/theme/useTheme";
import {type TextType, textStyles} from "./Text.styles";

export type {TextType};

export type ThemedTextProps = {
    children: string;
    type?: TextType;
    color?: string;
    align?: "left" | "center" | "right";
    numberOfLines?: number;
    style?: UniversalStyle;
    testID?: string;
    onPress?: () => void;
};

export const Text = ({
    children,
    type = "default",
    color,
    align,
    numberOfLines,
    style,
    testID,
    onPress,
}: ThemedTextProps) => {
    const {text, accent, error} = useTheme();

    const toneByType: Partial<Record<TextType, string>> = {
        link: accent,
        error,
    };

    return (
        <UIText
            testID={testID}
            numberOfLines={numberOfLines}
            onPress={onPress}
            style={type === "caption" ? {opacity: OPACITY[3], ...style} : style}
            textStyle={{
                ...textStyles[type],
                color: color ?? toneByType[type] ?? text,
                textAlign: align,
            }}
        >
            {children}
        </UIText>
    );
};
