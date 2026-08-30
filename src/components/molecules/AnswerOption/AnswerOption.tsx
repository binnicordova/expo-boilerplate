import {Row, Spacer, Button as UIButton} from "@expo/ui";
import type {ReactNode} from "react";
import {Icon} from "@/components/atoms/Icon/Icon";
import type {IconName} from "@/components/atoms/Icon/icons";
import {Surface} from "@/components/atoms/Surface/Surface";
import {Text} from "@/components/atoms/Text/Text";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";
import {surfaceModifiers, surfaceStyle} from "@/theme/surface";
import type {SurfaceSpec} from "@/theme/surface.types";
import {ICON_SIZE} from "@/theme/typography";
import {useTheme} from "@/theme/useTheme";

export type AnswerOptionState =
    | "idle"
    | "selected"
    | "correct"
    | "incorrect"
    | "missed";

export type AnswerOptionProps = {
    label: string;
    marker?: string;
    state?: AnswerOptionState;
    disabled?: boolean;
    testID?: string;
    onPress?: () => void;
};

const MARKER_SIZE = 24;

const STATE_INDEX: Record<AnswerOptionState, number> = {
    idle: 0,
    selected: 1,
    correct: 2,
    incorrect: 3,
    missed: 4,
};

const STATE_ICON: Record<AnswerOptionState, IconName> = {
    idle: "pending",
    selected: "success",
    correct: "success",
    incorrect: "failure",
    missed: "success",
};

export const AnswerOption = ({
    label,
    marker,
    state = "idle",
    disabled,
    testID,
    onPress,
}: AnswerOptionProps) => {
    const {
        accent,
        darkness,
        error,
        errorSurface,
        lightness,
        onAccent,
        success,
        successSurface,
    } = useTheme();

    const toneByState: Record<AnswerOptionState, string> = {
        idle: accent,
        selected: accent,
        correct: success,
        incorrect: error,
        missed: success,
    };

    const surfaceByState: Record<AnswerOptionState, string> = {
        idle: lightness,
        selected: accent,
        correct: successSurface,
        incorrect: errorSurface,
        missed: successSurface,
    };

    const tone = toneByState[state];
    const isSelected = state === "selected";
    const isResolved = state !== "idle" && !isSelected;

    const spec: SurfaceSpec = {
        fill: true,
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[4],
        radius: RADIUS[5] * 1.5,
        backgroundColor: surfaceByState[state],
        borderColor: isResolved ? tone : undefined,
        borderWidth: isResolved ? 2 : undefined,
        animateOn: STATE_INDEX[state],
        interactive: !disabled,
    };

    const content: ReactNode = (
        <Row
            alignment="center"
            spacing={SPACING[3]}
            modifiers={surfaceModifiers(spec)}
            style={surfaceStyle(spec)}
        >
            {marker ? (
                <Surface
                    size={MARKER_SIZE}
                    radius="capsule"
                    alignment="center"
                    backgroundColor={isSelected ? onAccent : tone}
                >
                    <Text
                        type="caption"
                        color={isSelected ? tone : onAccent}
                        align="center"
                    >
                        {marker}
                    </Text>
                </Surface>
            ) : (
                <Icon
                    name={STATE_ICON[state]}
                    size={ICON_SIZE.medium}
                    color={isSelected ? onAccent : tone}
                />
            )}

            <Text type="default" color={isSelected ? onAccent : darkness}>
                {label}
            </Text>

            <Spacer flexible />
        </Row>
    );

    if (disabled) {
        return <Row testID={testID}>{content}</Row>;
    }

    return (
        <UIButton
            testID={testID}
            variant="text"
            onPress={onPress}
            // Web sizing only — the fallback button is a fixed-height
            // inline-flex box. Visuals and hit area live on the label.
            style={surfaceStyle({
                fill: true,
                paddingHorizontal: 0,
                paddingVertical: 0,
            })}
        >
            {content}
        </UIButton>
    );
};
