import {View} from "react-native";
import {Button} from "@/components/Button/Button";
import {Icon} from "@/components/Icon/Icon";
import {Text} from "@/components/Text/Text";
import type {CooldownState, Readiness} from "@/models/certification";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {formatCooldown} from "@/utils/certification";
import {styles} from "./ReadinessCard.styles";

export type ReadinessCardProps = {
    readiness: Readiness;
    cooldown: CooldownState;
    onStart: () => void;
};

const CORRECT_COLOR = "#1B873F";

export const ReadinessCard = ({
    readiness,
    cooldown,
    onStart,
}: ReadinessCardProps) => {
    const {accent, lightness, darkness, text} = theme();

    const locked = !readiness.eligible || cooldown.blocked;

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: lightness, borderColor: accent},
            ]}
        >
            <View style={styles.header}>
                <Text type="caption" style={[styles.title, {color: accent}]}>
                    Certification exam
                </Text>
                <Text type="caption" style={{color: text}}>
                    {Math.round(readiness.progress * 100)}% ready
                </Text>
            </View>

            <View style={[styles.track, {backgroundColor: darkness}]}>
                <View
                    style={[
                        styles.fill,
                        {
                            backgroundColor: accent,
                            width: `${Math.round(readiness.progress * 100)}%`,
                        },
                    ]}
                />
            </View>

            {readiness.requirements.map((requirement) => (
                <View key={requirement.id} style={styles.requirement}>
                    <Icon
                        name={
                            requirement.met
                                ? "checkmark-circle"
                                : "ellipse-outline"
                        }
                        size={FONT_SIZE[2]}
                        color={requirement.met ? CORRECT_COLOR : text}
                    />
                    <Text
                        type="caption"
                        style={[styles.requirementLabel, {color: text}]}
                    >
                        {requirement.label}
                    </Text>
                    <Text
                        type="caption"
                        style={{
                            color: requirement.met ? CORRECT_COLOR : darkness,
                        }}
                    >
                        {Math.min(requirement.current, requirement.target)} /{" "}
                        {requirement.target}
                    </Text>
                </View>
            ))}

            {cooldown.blocked ? (
                <Text type="caption" style={{color: text}}>
                    Next attempt available in{" "}
                    {formatCooldown(cooldown.remainingMs)}.
                </Text>
            ) : (
                <Button
                    title={
                        readiness.eligible
                            ? "Start certification exam"
                            : "Keep practising to unlock"
                    }
                    disabled={locked}
                    onPress={onStart}
                />
            )}
        </View>
    );
};
