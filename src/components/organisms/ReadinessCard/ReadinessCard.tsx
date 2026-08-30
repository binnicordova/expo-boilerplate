import {Column, Row, Spacer} from "@expo/ui";
import {Button} from "@/components/atoms/Button/Button";
import {Icon} from "@/components/atoms/Icon/Icon";
import {ProgressBar} from "@/components/atoms/ProgressBar/ProgressBar";
import {Text} from "@/components/atoms/Text/Text";
import {Card} from "@/components/molecules/Card/Card";
import type {CooldownState, Readiness} from "@/models/certification";
import {FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";
import {formatCooldown} from "@/utils/certification";

export type ReadinessCardProps = {
    readiness: Readiness;
    cooldown: CooldownState;
    onStart: () => void;
};

const FULL_WIDTH = {width: "100%"} as const;

export const ReadinessCard = ({
    readiness,
    cooldown,
    onStart,
}: ReadinessCardProps) => {
    const {accent, darkness, muted, success, text} = useTheme();

    const locked = !readiness.eligible || cooldown.blocked;

    return (
        <Card testID="readiness-card">
            <Row alignment="center" style={FULL_WIDTH}>
                <Text type="caption" color={accent}>
                    Certification exam
                </Text>
                <Spacer flexible />
                <Text type="caption" color={text}>
                    {`${Math.round(readiness.progress * 100)}% ready`}
                </Text>
            </Row>

            <ProgressBar
                progress={readiness.progress}
                testID="readiness-progress"
            />

            <Column spacing={SPACING[2]} style={FULL_WIDTH}>
                {readiness.requirements.map((requirement) => (
                    <Row
                        key={requirement.id}
                        alignment="center"
                        spacing={SPACING[2]}
                        style={FULL_WIDTH}
                    >
                        <Icon
                            name={requirement.met ? "success" : "pending"}
                            size={FONT_SIZE[2]}
                            color={requirement.met ? success : muted}
                        />
                        <Text type="label" color={text}>
                            {requirement.label}
                        </Text>
                        <Spacer flexible />
                        <Text
                            type="caption"
                            color={requirement.met ? success : darkness}
                        >
                            {`${Math.min(requirement.current, requirement.target)} / ${requirement.target}`}
                        </Text>
                    </Row>
                ))}
            </Column>

            {cooldown.blocked ? (
                <Text type="caption" color={text}>
                    {`Next attempt available in ${formatCooldown(cooldown.remainingMs)}.`}
                </Text>
            ) : (
                <Button
                    testID="start-exam"
                    title={
                        readiness.eligible
                            ? "Start certification exam"
                            : "Keep practising to unlock"
                    }
                    disabled={locked}
                    onPress={onStart}
                />
            )}
        </Card>
    );
};
