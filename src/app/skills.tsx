import {useAtomValue} from "jotai";
import {Text} from "@/components/atoms/Text/Text";
import {AppBar} from "@/components/molecules/AppBar/AppBar";
import {ProgressHeader} from "@/components/organisms/ProgressHeader/ProgressHeader";
import {SkillTree} from "@/components/organisms/SkillTree/SkillTree";
import {Screen} from "@/components/templates/Screen/Screen";
import {
    badgesAtom,
    levelAtom,
    levelProgressAtom,
    skillTreeAtom,
    xpAtom,
} from "@/stores/progression";
import {activeStreakAtom, dueReviewsAtom} from "@/stores/retention";

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

            <Text type="caption" align="center">
                Nodes unlock as the domains they depend on reach their mastery
                threshold.
            </Text>

            <SkillTree nodes={nodes} />
        </Screen>
    );
};

export default SkillsScreen;
