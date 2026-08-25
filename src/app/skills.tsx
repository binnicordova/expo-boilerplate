import {useAtomValue} from "jotai";
import {AppBar} from "@/components/AppBar/AppBar";
import {ProgressHeader} from "@/components/ProgressHeader/ProgressHeader";
import {Screen} from "@/components/Screen/Screen";
import {SkillTree} from "@/components/SkillTree/SkillTree";
import {Text} from "@/components/Text/Text";
import {
    badgesAtom,
    levelAtom,
    levelProgressAtom,
    skillTreeAtom,
    xpAtom,
} from "@/stores/progression";
import {activeStreakAtom, dueReviewsAtom} from "@/stores/retention";
import {styles} from "@/styles";

const SkillsScreen = () => {
    const nodes = useAtomValue(skillTreeAtom);
    const level = useAtomValue(levelAtom);
    const xp = useAtomValue(xpAtom);
    const levelProgress = useAtomValue(levelProgressAtom);
    const badges = useAtomValue(badgesAtom);
    const streak = useAtomValue(activeStreakAtom);
    const dueReviews = useAtomValue(dueReviewsAtom);

    return (
        <Screen>
            <AppBar title="Skill Tree" />

            <ProgressHeader
                level={level}
                xp={xp}
                levelProgress={levelProgress}
                streak={streak}
                dueReviews={dueReviews.length}
                badges={badges}
            />

            <Text type="caption" style={styles.progressText}>
                Nodes unlock as the domains they depend on reach their mastery
                threshold.
            </Text>

            <SkillTree nodes={nodes} />
        </Screen>
    );
};

export default SkillsScreen;
