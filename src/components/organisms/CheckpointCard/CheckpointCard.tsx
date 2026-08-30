import {Column, Row, Spacer} from "@expo/ui";
import {Button} from "@/components/atoms/Button/Button";
import {Text} from "@/components/atoms/Text/Text";
import {Card} from "@/components/molecules/Card/Card";
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

const encouragement = (accuracy: number) => {
    if (accuracy >= 0.9) {
        return "Exceptional run. Ready to push into harder material?";
    }

    if (accuracy >= 0.7) {
        return "Solid pace. A few more and the next tier opens up.";
    }

    return "The misses are queued for review. Keep going while it is fresh.";
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

    return (
        <Card alignment="center" testID="checkpoint-card">
            <Text type="title" color={darkness} align="center">
                {`${checkpoint.answered} answered`}
            </Text>

            <Text type="label" color={text} align="center">
                {encouragement(checkpoint.accuracy)}
            </Text>

            <Row alignment="center" style={FULL_WIDTH}>
                <Stat
                    label="Accuracy"
                    value={`${Math.round(checkpoint.accuracy * 100)}%`}
                />
                <Spacer flexible />
                <Stat label="Correct" value={`${checkpoint.correct}`} />
                <Spacer flexible />
                <Stat label="XP" value={`+${checkpoint.xpEarned}`} />
            </Row>

            <Column spacing={SPACING[2]} style={FULL_WIDTH}>
                <Button
                    testID="checkpoint-continue"
                    title={`Keep going · ${nextMilestone} more`}
                    onPress={onContinue}
                />
                <Button
                    testID="checkpoint-stop"
                    title="Save progress and pause"
                    variant="outlined"
                    onPress={onStop}
                />
            </Column>
        </Card>
    );
};
