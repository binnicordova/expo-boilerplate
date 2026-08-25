import {View} from "react-native";
import {Icon, type IconName} from "@/components/Icon/Icon";
import {Text} from "@/components/Text/Text";
import {TouchableWrapper} from "@/components/TouchableWrapper/TouchableWrapper";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {OPACITY} from "@/theme/opcacity";
import {styles} from "./AnswerOption.styles";

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
    onPress?: () => void;
};

const CORRECT_COLOR = "#1B873F";

const STATE_ICON: Record<AnswerOptionState, IconName> = {
    idle: "ellipse-outline",
    selected: "checkmark",
    correct: "checkmark",
    incorrect: "close",
    missed: "checkmark",
};

export const AnswerOption = ({
    label,
    marker,
    state = "idle",
    disabled,
    onPress,
}: AnswerOptionProps) => {
    const {accent, background, darkness, error} = theme();

    const accentByState: Record<AnswerOptionState, string> = {
        idle: accent,
        selected: accent,
        correct: CORRECT_COLOR,
        incorrect: error,
        missed: CORRECT_COLOR,
    };

    const borderColor = accentByState[state];
    const isFilled =
        state === "selected" || state === "correct" || state === "incorrect";

    return (
        <TouchableWrapper
            accessibilityRole="button"
            accessibilityState={{
                selected: state === "selected",
                disabled: Boolean(disabled),
            }}
            disabled={disabled}
            onPress={disabled ? undefined : onPress}
            style={[
                styles.container,
                {
                    borderColor,
                    backgroundColor: isFilled ? borderColor : background,
                    opacity: state === "missed" ? OPACITY[3] : OPACITY[4],
                },
            ]}
        >
            <View
                style={[
                    styles.marker,
                    {
                        borderColor: isFilled ? background : borderColor,
                        backgroundColor: isFilled ? borderColor : background,
                    },
                ]}
            >
                {marker ? (
                    <Text
                        type="label"
                        style={[
                            styles.markerLabel,
                            {color: isFilled ? background : borderColor},
                        ]}
                    >
                        {marker}
                    </Text>
                ) : (
                    <Icon
                        name={STATE_ICON[state]}
                        size={FONT_SIZE[2] - 2}
                        color={isFilled ? background : borderColor}
                    />
                )}
            </View>

            <Text
                type="label"
                style={[
                    styles.label,
                    {color: isFilled ? background : darkness},
                ]}
            >
                {label}
            </Text>
        </TouchableWrapper>
    );
};
