import {Row, Spacer} from "@expo/ui";
import {Icon} from "@/components/atoms/Icon/Icon";
import {Surface} from "@/components/atoms/Surface/Surface";
import {Text} from "@/components/atoms/Text/Text";
import {Card} from "@/components/molecules/Card/Card";
import {useTranslation} from "@/i18n";
import type {MicroLearningDigest} from "@/models/assessment";
import {SPACING} from "@/theme/spacing";
import {ICON_SIZE} from "@/theme/typography";
import {useTheme} from "@/theme/useTheme";

export type MicroLearningCardProps = {
    digest: MicroLearningDigest;
    correct: boolean;
    xpAwarded?: number;
    /**
     * `plain` drops the card chrome for contexts that already provide their
     * own surface, such as the practice bottom sheet.
     */
    variant?: "card" | "plain";
};

export const MicroLearningCard = ({
    digest,
    correct,
    xpAwarded,
    variant = "card",
}: MicroLearningCardProps) => {
    const {darkness, muted, text, error, success} = useTheme();
    const {t} = useTranslation();
    const tone = correct ? success : error;

    const content = (
        <>
            <Row
                alignment="center"
                spacing={SPACING[2]}
                style={{width: "100%"}}
            >
                <Icon
                    name={correct ? "success" : "alert"}
                    size={ICON_SIZE.large}
                    color={tone}
                />
                <Text type="subtitle" color={tone}>
                    {correct ? t("digest.correct") : t("digest.incorrect")}
                </Text>
                <Spacer flexible />
                {Boolean(xpAwarded) && (
                    <Text type="label" color={tone}>
                        {t("digest.xpAwarded", {xp: xpAwarded ?? 0})}
                    </Text>
                )}
            </Row>

            <Text type="subtitle" color={darkness}>
                {digest.headline}
            </Text>

            <Text type="default" color={text}>
                {digest.body}
            </Text>

            {digest.reference && (
                <Text type="caption" color={muted}>
                    {digest.reference}
                </Text>
            )}
        </>
    );

    if (variant === "plain") {
        return (
            <Surface fill spacing={SPACING[3]} testID="micro-learning-card">
                {content}
            </Surface>
        );
    }

    return (
        <Card borderColor={tone} testID="micro-learning-card">
            {content}
        </Card>
    );
};
