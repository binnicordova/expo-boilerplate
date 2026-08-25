import {View} from "react-native";
import {Icon} from "@/components/Icon/Icon";
import {Text} from "@/components/Text/Text";
import type {Badge} from "@/models/progression";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {styles} from "./ProgressHeader.styles";

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

const GOAL_COLOR = "#1B873F";

const TIER_COLOR: Record<Badge["tier"], string> = {
    bronze: "#B06A2C",
    silver: "#7C8B9B",
    gold: "#C79A16",
};

export const ProgressHeader = ({
    level,
    xp,
    levelProgress,
    streak,
    dueReviews,
    dailyGoal,
    badges,
}: ProgressHeaderProps) => {
    const {accent, background, darkness, text, lightness} = theme();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text type="label" style={{color: darkness}}>
                    Level {level} · {xp} XP
                </Text>

                <View style={styles.row}>
                    <View style={[styles.pill, {borderColor: accent}]}>
                        <Icon
                            name="flame"
                            size={FONT_SIZE[2]}
                            color={streak > 0 ? accent : text}
                        />
                        <Text
                            type="caption"
                            style={[styles.pillLabel, {color: darkness}]}
                        >
                            {streak}d
                        </Text>
                    </View>

                    {dueReviews > 0 && (
                        <View style={[styles.pill, {borderColor: accent}]}>
                            <Icon
                                name="refresh"
                                size={FONT_SIZE[2]}
                                color={accent}
                            />
                            <Text
                                type="caption"
                                style={[styles.pillLabel, {color: darkness}]}
                            >
                                {dueReviews}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={[styles.track, {backgroundColor: lightness}]}>
                <View
                    style={[
                        styles.fill,
                        {
                            backgroundColor: accent,
                            width: `${Math.round(levelProgress * 100)}%`,
                        },
                    ]}
                />
            </View>

            {dailyGoal && (
                <View style={styles.row}>
                    <Text type="caption" style={{color: text}}>
                        Daily goal
                    </Text>
                    <Text
                        type="caption"
                        style={{
                            color: dailyGoal.met ? GOAL_COLOR : darkness,
                        }}
                    >
                        {dailyGoal.met
                            ? "Complete"
                            : `${dailyGoal.correct} / ${dailyGoal.target}`}
                    </Text>
                </View>
            )}

            {badges.length > 0 && (
                <View style={styles.badges}>
                    {badges.map((badge) => (
                        <View
                            key={badge.id}
                            style={[
                                styles.pill,
                                {
                                    borderColor: TIER_COLOR[badge.tier],
                                    backgroundColor: background,
                                },
                            ]}
                        >
                            <Icon
                                name="ribbon"
                                size={FONT_SIZE[2]}
                                color={TIER_COLOR[badge.tier]}
                            />
                            <Text
                                type="caption"
                                style={[styles.pillLabel, {color: darkness}]}
                            >
                                {badge.label}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};
