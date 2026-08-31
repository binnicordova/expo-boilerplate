import {Column, Row, Spacer} from "@expo/ui";
import {ProgressBar} from "@/components/atoms/ProgressBar/ProgressBar";
import {Text} from "@/components/atoms/Text/Text";
import {useTranslation} from "@/i18n";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";

export type ChallengeTimerProps = {
    label: string;
    remainingSeconds: number;
    totalSeconds: number;
    answered: number;
    total: number;
};

const WARNING_RATIO = 0.25;
const FULL_WIDTH = {width: "100%"} as const;

export const ChallengeTimer = ({
    label,
    remainingSeconds,
    totalSeconds,
    answered,
    total,
}: ChallengeTimerProps) => {
    const {accent, darkness, error, text} = useTheme();
    const {t} = useTranslation();
    const ratio = totalSeconds ? remainingSeconds / totalSeconds : 0;
    const tone = ratio <= WARNING_RATIO ? error : accent;

    return (
        <Column
            spacing={SPACING[2]}
            style={FULL_WIDTH}
            testID="challenge-timer"
        >
            <Row alignment="center" style={FULL_WIDTH}>
                <Text type="label" color={darkness}>
                    {label}
                </Text>
                <Spacer flexible />
                <Text type="label" color={tone}>
                    {t("challenge.remaining", {seconds: remainingSeconds})}
                </Text>
            </Row>

            <ProgressBar
                progress={ratio}
                color={tone}
                testID="timer-progress"
            />

            <Text type="caption" color={text}>
                {t("challenge.answered", {answered, total})}
            </Text>
        </Column>
    );
};
