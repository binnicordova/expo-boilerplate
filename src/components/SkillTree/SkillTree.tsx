import {View} from "react-native";
import {Icon, type IconName} from "@/components/Icon/Icon";
import {Text} from "@/components/Text/Text";
import {DOMAIN_LABEL} from "@/constants/assessment";
import type {SkillNodeStatus, SkillNodeView} from "@/models/progression";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {OPACITY} from "@/theme/opcacity";
import {styles} from "./SkillTree.styles";

export type SkillTreeProps = {
    nodes: SkillNodeView[];
};

const STATUS_ICON: Record<SkillNodeStatus, IconName> = {
    locked: "lock-closed",
    available: "ellipse-outline",
    mastered: "checkmark-circle",
};

export const SkillTree = ({nodes}: SkillTreeProps) => {
    const {accent, background, darkness, lightness, text} = theme();

    return (
        <View style={styles.container}>
            {nodes.map((node) => {
                const isLocked = node.status === "locked";
                const tone = isLocked ? text : accent;

                return (
                    <View
                        key={node.id}
                        style={[
                            styles.node,
                            {
                                borderColor: tone,
                                backgroundColor: isLocked
                                    ? background
                                    : lightness,
                                opacity: isLocked ? OPACITY[2] : OPACITY[4],
                            },
                        ]}
                    >
                        <View style={styles.header}>
                            <Icon
                                name={STATUS_ICON[node.status]}
                                size={FONT_SIZE[2]}
                                color={tone}
                            />
                            <Text
                                type="label"
                                style={[styles.label, {color: darkness}]}
                            >
                                {node.label}
                            </Text>
                            <Text type="caption" style={{color: text}}>
                                {DOMAIN_LABEL[node.domain]}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.track,
                                {backgroundColor: background},
                            ]}
                        >
                            <View
                                style={[
                                    styles.fill,
                                    {
                                        backgroundColor: tone,
                                        width: `${Math.round(node.progress * 100)}%`,
                                    },
                                ]}
                            />
                        </View>

                        <Text
                            type="caption"
                            style={[styles.requirement, {color: text}]}
                        >
                            {node.status === "mastered"
                                ? "Mastered"
                                : `Requires ${Math.round(node.masteryRequired * 100)}% mastery`}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};
