import {Column, Row, Spacer} from "@expo/ui";
import {Pill} from "@/components/atoms/Pill/Pill";
import {ProgressBar} from "@/components/atoms/ProgressBar/ProgressBar";
import {Text} from "@/components/atoms/Text/Text";
import {useTranslation} from "@/i18n";
import type {Badge, BadgeTier} from "@/models/progression";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";

export type DailyGoal = {
    correct: number;
    target: number;
    progress: number;
    met: boolean;
};

export type ProgressHeaderProps = {
    level: number;
    xp: number;
    levelProgress: number;
    streak: number;
    dueReviews: number;
    dailyGoal?: DailyGoal;
    badges: Badge[];
};

const TIER_COLOR: Record<BadgeTier, string> = {
    bronze: "#B06A2C",
    silver: "#7C8B9B",
    gold: "#C79A16",
};

const FULL_WIDTH = {width: "100%"} as const;

export const ProgressHeader = ({
    level,
    xp,
    levelProgress,
    streak,
    dueReviews,
    dailyGoal,
    badges,
}: ProgressHeaderProps) => {
    const {accent, darkness, success, surface, text} = useTheme();
    const {t} = useTranslation();

    return (
        <Column
            spacing={SPACING[2]}
            style={FULL_WIDTH}
            testID="progress-header"
        >
            <Row alignment="center" spacing={SPACING[2]} style={FULL_WIDTH}>
                <Text type="label" color={darkness}>
                    {t("progress.level", {level, xp})}
                </Text>

                <Spacer flexible />

                <Pill
                    icon="streak"
                    label={t("progress.streak", {days: streak})}
                    tone={streak > 0 ? accent : text}
                    testID="streak-pill"
                />

                {dueReviews > 0 && (
                    <Pill
                        icon="review"
                        label={`${dueReviews}`}
                        testID="reviews-pill"
                    />
                )}
            </Row>

            <ProgressBar progress={levelProgress} testID="level-progress" />

            {dailyGoal && (
                <Row alignment="center" style={FULL_WIDTH}>
                    <Text type="caption" color={text}>
                        {t("progress.dailyGoal")}
                    </Text>
                    <Spacer flexible />
                    <Text
                        type="caption"
                        color={dailyGoal.met ? success : darkness}
                    >
                        {dailyGoal.met
                            ? t("progress.dailyGoalComplete")
                            : t("progress.dailyGoalProgress", {
                                  correct: dailyGoal.correct,
                                  target: dailyGoal.target,
                              })}
                    </Text>
                </Row>
            )}

            {badges.length > 0 && (
                <Row spacing={SPACING[2]} alignment="center" style={FULL_WIDTH}>
                    {badges.map((badge) => (
                        <Pill
                            key={badge.id}
                            icon="badge"
                            label={t("badge.label", {
                                domain: badge.domain,
                                tier: badge.tier,
                            })}
                            tone={TIER_COLOR[badge.tier]}
                            backgroundColor={surface}
                        />
                    ))}
                </Row>
            )}
        </Column>
    );
};
