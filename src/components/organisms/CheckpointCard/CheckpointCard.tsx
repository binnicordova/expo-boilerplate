import {Column, Row, Spacer} from "@expo/ui";
import {Button} from "@/components/atoms/Button/Button";
import {Text} from "@/components/atoms/Text/Text";
import {Card} from "@/components/molecules/Card/Card";
import {useTranslation} from "@/i18n";
import type {TranslationKey} from "@/i18n/types";
import type {SessionCheckpoint} from "@/stores/quiz";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";

export type CheckpointCardProps = {
    checkpoint: SessionCheckpoint;
    nextMilestone: number;
    onContinue: () => void;
    onStop: () => void;
};

const FULL_WIDTH = {width: "100%"} as const;

const STRONG_RUN = 0.9;
const STEADY_RUN = 0.7;

const encouragementKey = (accuracy: number): TranslationKey => {
    if (accuracy >= STRONG_RUN) {
        return "checkpoint.encouragement.high";
    }

    if (accuracy >= STEADY_RUN) {
        return "checkpoint.encouragement.medium";
    }

    return "checkpoint.encouragement.low";
};

const Stat = ({label, value}: {label: string; value: string}) => {
    const {accent, text} = useTheme();

    return (
        <Column alignment="center" spacing={SPACING[1]}>
            <Text type="subtitle" color={accent} align="center">
                {value}
            </Text>
            <Text type="caption" color={text} align="center">
                {label}
            </Text>
        </Column>
    );
};

export const CheckpointCard = ({
    checkpoint,
    nextMilestone,
    onContinue,
    onStop,
}: CheckpointCardProps) => {
    const {darkness, text} = useTheme();
    const {t} = useTranslation();

    return (
        <Card alignment="center" testID="checkpoint-card">
            <Text type="title" color={darkness} align="center">
                {t("checkpoint.answered", {answered: checkpoint.answered})}
            </Text>

            <Text type="label" color={text} align="center">
                {t(encouragementKey(checkpoint.accuracy))}
            </Text>

            <Row alignment="center" style={FULL_WIDTH}>
                <Stat
                    label={t("checkpoint.accuracy")}
                    value={`${Math.round(checkpoint.accuracy * 100)}%`}
                />
                <Spacer flexible />
                <Stat
                    label={t("checkpoint.correct")}
                    value={`${checkpoint.correct}`}
                />
                <Spacer flexible />
                <Stat
                    label={t("checkpoint.xp")}
                    value={`+${checkpoint.xpEarned}`}
                />
            </Row>

            <Column spacing={SPACING[2]} style={FULL_WIDTH}>
                <Button
                    testID="checkpoint-continue"
                    title={t("checkpoint.keepGoing", {
                        remaining: nextMilestone,
                    })}
                    onPress={onContinue}
                />
                <Button
                    testID="checkpoint-stop"
                    title={t("checkpoint.pause")}
                    variant="outlined"
                    onPress={onStop}
                />
            </Column>
        </Card>
    );
};
