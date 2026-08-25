import {SKILL_TREE} from "@/constants/assessment";
import type {
    ProgressionState,
    SkillNode,
    SkillNodeStatus,
    SkillNodeView,
} from "@/models/progression";
import {getMastery} from "@/utils/progression";

export const resolveSkillTree = (
    progression: ProgressionState,
    nodes: SkillNode[] = SKILL_TREE
): SkillNodeView[] => {
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const mastered = new Map<string, boolean>();

    const isMastered = (nodeId: string, seen: Set<string>): boolean => {
        const cached = mastered.get(nodeId);
        if (cached !== undefined) {
            return cached;
        }

        const node = byId.get(nodeId);
        if (!node || seen.has(nodeId)) {
            return false;
        }

        seen.add(nodeId);

        const unlocked = node.dependsOn.every((dependency) =>
            isMastered(dependency, seen)
        );
        const score = getMastery(progression, node.domain).score;
        const result = unlocked && score >= node.masteryRequired;

        mastered.set(nodeId, result);
        return result;
    };

    return nodes.map((node) => {
        const score = getMastery(progression, node.domain).score;
        const unlocked = node.dependsOn.every((dependency) =>
            isMastered(dependency, new Set())
        );

        const status: SkillNodeStatus = !unlocked
            ? "locked"
            : score >= node.masteryRequired
              ? "mastered"
              : "available";

        return {
            ...node,
            status,
            progress: Math.min(1, score / node.masteryRequired),
        };
    });
};

export const getUnlockedDomains = (views: SkillNodeView[]) => [
    ...new Set(
        views
            .filter((view) => view.status !== "locked")
            .map((view) => view.domain)
    ),
];
