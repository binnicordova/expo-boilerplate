import {Column, Row, Spacer} from "@expo/ui";
import {Icon} from "@/components/atoms/Icon/Icon";
import type {IconName} from "@/components/atoms/Icon/icons";
import {ProgressBar} from "@/components/atoms/ProgressBar/ProgressBar";
import {Text} from "@/components/atoms/Text/Text";
import {Card} from "@/components/molecules/Card/Card";
import {DOMAIN_LABEL} from "@/constants/assessment";
import type {SkillNodeStatus, SkillNodeView} from "@/models/progression";
import {FONT_SIZE} from "@/theme/fonts";
import {OPACITY} from "@/theme/opcacity";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";

export type SkillTreeProps = {
    nodes: SkillNodeView[];
};

const STATUS_ICON: Record<SkillNodeStatus, IconName> = {
    locked: "locked",
    available: "pending",
    mastered: "success",
};

const FULL_WIDTH = {width: "100%"} as const;

export const SkillTree = ({nodes}: SkillTreeProps) => {
    const {accent, background, darkness, lightness, text} = useTheme();

    return (
        <Column spacing={SPACING[3]} style={FULL_WIDTH} testID="skill-tree">
            {nodes.map((node) => {
                const isLocked = node.status === "locked";
                const tone = isLocked ? text : accent;

                return (
                    <Card
                        key={node.id}
                        testID={`skill-node-${node.id}`}
                        borderColor={tone}
                        backgroundColor={isLocked ? background : lightness}
                        opacity={isLocked ? OPACITY[2] : OPACITY[4]}
                    >
                        <Row
                            alignment="center"
                            spacing={SPACING[2]}
                            style={FULL_WIDTH}
                        >
                            <Icon
                                name={STATUS_ICON[node.status]}
                                size={FONT_SIZE[2]}
                                color={tone}
                            />
                            <Text type="label" color={darkness}>
                                {node.label}
                            </Text>
                            <Spacer flexible />
                            <Text type="caption" color={text}>
                                {DOMAIN_LABEL[node.domain]}
                            </Text>
                        </Row>

                        <ProgressBar
                            progress={node.progress}
                            color={tone}
                            trackColor={background}
                        />

                        <Text type="caption" color={text}>
                            {node.status === "mastered"
                                ? "Mastered"
                                : `Requires ${Math.round(node.masteryRequired * 100)}% mastery`}
                        </Text>
                    </Card>
                );
            })}
        </Column>
    );
};
