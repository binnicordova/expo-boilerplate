import {View} from "react-native";
import {Button} from "@/components/Button/Button";
import {Text} from "@/components/Text/Text";
import type {SessionCheckpoint} from "@/stores/quiz";
import {theme} from "@/theme/colors";
import {styles} from "./CheckpointCard.styles";

export type CheckpointCardProps = {
    checkpoint: SessionCheckpoint;
    nextMilestone: number;
    onContinue: () => void;
    onStop: () => void;
};

const encouragement = (accuracy: number) => {
    if (accuracy >= 0.9) {
        return "Exceptional run. Ready to push into harder material?";
    }

    if (accuracy >= 0.7) {
        return "Solid pace. A few more and the next tier opens up.";
    }

    return "The misses are queued for review. Keep going while it is fresh.";
};

export const CheckpointCard = ({
    checkpoint,
    nextMilestone,
    onContinue,
    onStop,
}: CheckpointCardProps) => {
    const {accent, lightness, darkness, text, background} = theme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: lightness, borderColor: accent},
            ]}
        >
            <Text type="title" style={[styles.headline, {color: darkness}]}>
                {checkpoint.answered} answered
            </Text>

            <Text type="label" style={[styles.headline, {color: text}]}>
                {encouragement(checkpoint.accuracy)}
            </Text>

            <View style={styles.stats}>
                <View style={styles.stat}>
                    <Text type="subtitle" style={{color: accent}}>
                        {Math.round(checkpoint.accuracy * 100)}%
                    </Text>
                    <Text
                        type="caption"
                        style={[styles.statLabel, {color: text}]}
                    >
                        Accuracy
                    </Text>
                </View>

                <View style={styles.stat}>
                    <Text type="subtitle" style={{color: accent}}>
                        {checkpoint.correct}
                    </Text>
                    <Text
                        type="caption"
                        style={[styles.statLabel, {color: text}]}
                    >
                        Correct
                    </Text>
                </View>

                <View style={styles.stat}>
                    <Text type="subtitle" style={{color: accent}}>
                        +{checkpoint.xpEarned}
                    </Text>
                    <Text
                        type="caption"
                        style={[styles.statLabel, {color: text}]}
                    >
                        XP
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                <Button
                    title={`Keep going · ${nextMilestone} more`}
                    onPress={onContinue}
                />
                <Button
                    title="Save progress and pause"
                    onPress={onStop}
                    style={{backgroundColor: background, borderColor: accent}}
                    textColor={accent}
                />
            </View>
        </View>
    );
};
