import {View} from "react-native";
import {Text} from "@/components/Text/Text";
import {theme} from "@/theme/colors";
import {styles} from "./ChallengeTimer.styles";

export type ChallengeTimerProps = {
    label: string;
    remainingSeconds: number;
    totalSeconds: number;
    answered: number;
    total: number;
};

const WARNING_RATIO = 0.25;

export const ChallengeTimer = ({
    label,
    remainingSeconds,
    totalSeconds,
    answered,
    total,
}: ChallengeTimerProps) => {
    const {accent, darkness, error, lightness, text} = theme();
    const ratio = totalSeconds ? remainingSeconds / totalSeconds : 0;
    const tone = ratio <= WARNING_RATIO ? error : accent;

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text type="label" style={{color: darkness}}>
                    {label}
                </Text>
                <Text type="label" style={{color: tone}}>
                    {remainingSeconds}s
                </Text>
            </View>

            <View style={[styles.track, {backgroundColor: lightness}]}>
                <View
                    style={[
                        styles.fill,
                        {
                            backgroundColor: tone,
                            width: `${Math.max(0, Math.round(ratio * 100))}%`,
                        },
                    ]}
                />
            </View>

            <Text type="caption" style={{color: text}}>
                {answered} of {total} answered
            </Text>
        </View>
    );
};
