import {useAtomValue} from "jotai";
import {Text} from "@/components/atoms/Text/Text";
import {AppBar} from "@/components/molecules/AppBar/AppBar";
import {LanguagePicker} from "@/components/organisms/LanguagePicker/LanguagePicker";
import {ProgressHeader} from "@/components/organisms/ProgressHeader/ProgressHeader";
import {SkillTree} from "@/components/organisms/SkillTree/SkillTree";
import {Screen} from "@/components/templates/Screen/Screen";
import {useTranslation} from "@/i18n";
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
    const {t} = useTranslation();

    return (
        <Screen>
            <AppBar title={t("skills.title")} />

            <ProgressHeader
                level={level}
                xp={xp}
                levelProgress={levelProgress}
                streak={streak}
                dueReviews={dueReviews.length}
                badges={badges}
            />

            <Text type="caption" align="center">
                {t("skills.blurb")}
            </Text>

            <SkillTree nodes={nodes} />

            <LanguagePicker />
        </Screen>
    );
};

export default SkillsScreen;
