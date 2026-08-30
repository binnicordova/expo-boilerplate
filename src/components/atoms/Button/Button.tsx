import {Row, Spacer, Button as UIButton} from "@expo/ui";
import {Text} from "@/components/atoms/Text/Text";
import {SPACING} from "@/theme/spacing";
import {surfaceModifiers, surfaceStyle} from "@/theme/surface";
import {useTheme} from "@/theme/useTheme";

export type ButtonVariant = "filled" | "outlined" | "text";

export type ButtonProps = {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
    variant?: ButtonVariant;
    testID?: string;
};

const LABEL_PADDING = SPACING[2];

export const Button = ({
    title,
    onPress,
    disabled,
    variant = "filled",
    testID,
}: ButtonProps) => {
    const {accent, onAccent} = useTheme();

    const labelColor = variant === "filled" ? onAccent : accent;

    return (
        <UIButton
            testID={testID}
            variant={variant}
            disabled={disabled}
            onPress={disabled ? undefined : onPress}
            style={surfaceStyle({
                fill: true,
                backgroundColor: variant === "filled" ? accent : undefined,
            })}
        >
            <Row
                alignment="center"
                modifiers={surfaceModifiers({
                    fill: true,
                    paddingVertical: LABEL_PADDING,
                    interactive: true,
                })}
                style={surfaceStyle({
                    fill: true,
                    paddingVertical: LABEL_PADDING,
                })}
            >
                <Spacer flexible />
                <Text type="label" color={labelColor} align="center">
                    {title}
                </Text>
                <Spacer flexible />
            </Row>
        </UIButton>
    );
};
