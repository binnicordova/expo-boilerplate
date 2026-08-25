import {View} from "react-native";
import {Icon} from "@/components/Icon/Icon";
import {Text} from "@/components/Text/Text";
import type {MicroLearningDigest} from "@/models/assessment";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {styles} from "./MicroLearningCard.styles";

export type MicroLearningCardProps = {
    digest: MicroLearningDigest;
    correct: boolean;
    xpAwarded?: number;
};

const CORRECT_COLOR = "#1B873F";

export const MicroLearningCard = ({
    digest,
    correct,
    xpAwarded,
}: MicroLearningCardProps) => {
    const {lightness, darkness, text, error} = theme();
    const tone = correct ? CORRECT_COLOR : error;

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: lightness, borderColor: tone},
            ]}
        >
            <View style={styles.header}>
                <Icon
                    name={correct ? "checkmark-circle" : "alert-circle"}
                    size={FONT_SIZE[3]}
                    color={tone}
                />
                <Text type="label" style={[styles.verdict, {color: tone}]}>
                    {correct ? "Correct" : "Not quite"}
                </Text>
                {Boolean(xpAwarded) && (
                    <Text type="caption" style={{color: tone}}>
                        +{xpAwarded} XP
                    </Text>
                )}
            </View>

            <Text type="subtitle" style={{color: darkness}}>
                {digest.headline}
            </Text>

            <Text type="label" style={{color: text}}>
                {digest.body}
            </Text>

            {digest.reference && (
                <Text type="caption" style={[styles.reference, {color: text}]}>
                    {digest.reference}
                </Text>
            )}
        </View>
    );
};
