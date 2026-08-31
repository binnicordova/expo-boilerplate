import {useAtomValue, useSetAtom} from "jotai";
import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/atoms/Button/Button";
import {Text} from "@/components/atoms/Text/Text";
import {AppBar} from "@/components/molecules/AppBar/AppBar";
import {Card} from "@/components/molecules/Card/Card";
import {ChallengeTimer} from "@/components/molecules/ChallengeTimer/ChallengeTimer";
import {QuestionCard} from "@/components/organisms/QuestionCard/QuestionCard";
import {Screen} from "@/components/templates/Screen/Screen";
import {PRACTICE_MAX_OPTIONS} from "@/constants/assessment";
import {useCountdown} from "@/hooks/useCountdown";
import {useTranslation} from "@/i18n";
import type {AssessmentQuestion} from "@/models/assessment";
import {api} from "@/services/api";
import {
    activeChallengeAtom,
    advanceChallengeAtom,
    availableChallengesAtom,
    challengeCorrectAtom,
    challengeDeadlineAtom,
    challengeIndexAtom,
    challengeQuestionIdsAtom,
    challengeStatusAtom,
    completeChallengeAtom,
    resetChallengeAtom,
    startChallengeAtom,
} from "@/stores/challenge";
import {respondAtom, responseByQuestionAtom} from "@/stores/question";
import {gradeQuestion, isResponseComplete} from "@/utils/grading";

const ChallengeScreen = () => {
    const challenges = useAtomValue(availableChallengesAtom);
    const definition = useAtomValue(activeChallengeAtom);
    const status = useAtomValue(challengeStatusAtom);
    const questionIds = useAtomValue(challengeQuestionIdsAtom);
    const index = useAtomValue(challengeIndexAtom);
    const correct = useAtomValue(challengeCorrectAtom);
    const deadline = useAtomValue(challengeDeadlineAtom);
    const responses = useAtomValue(responseByQuestionAtom);

    const startChallenge = useSetAtom(startChallengeAtom);
    const advanceChallenge = useSetAtom(advanceChallengeAtom);
    const completeChallenge = useSetAtom(completeChallengeAtom);
    const resetChallenge = useSetAtom(resetChallengeAtom);
    const respond = useSetAtom(respondAtom);

    const [question, setQuestion] = useState<AssessmentQuestion | null>(null);
    const {t} = useTranslation();

    const currentId = questionIds[index];

    useEffect(() => {
        if (!currentId) {
            setQuestion(null);
            return;
        }

        let active = true;

        void api
            .getAssessment(currentId)
            .then((value) => active && setQuestion(value))
            .catch(() => active && setQuestion(null));

        return () => {
            active = false;
        };
    }, [currentId]);

    const handleExpire = useCallback(() => {
        void completeChallenge({timedOut: true});
    }, [completeChallenge]);

    const {remainingSeconds} = useCountdown(
        status === "running" ? deadline : null,
        handleExpire
    );

    useEffect(() => {
        if (status === "running" && definition && index >= questionIds.length) {
            void completeChallenge();
        }
    }, [completeChallenge, definition, index, questionIds.length, status]);

    if (status === "idle" || !definition) {
        return (
            <Screen>
                <AppBar title={t("challenge.title")} />

                <Text type="caption" align="center">
                    {t("challenge.blurb")}
                </Text>

                {challenges.map((challenge) => (
                    <Card
                        key={challenge.id}
                        testID={`challenge-${challenge.id}`}
                    >
                        <Text type="subtitle">{t(challenge.labelKey)}</Text>
                        <Text type="caption">
                            {t("challenge.summary", {
                                questions: challenge.questionCount,
                                seconds: challenge.durationSeconds,
                                passingStreak: challenge.passingStreak,
                            })}
                        </Text>
                        <Button
                            testID={`start-${challenge.id}`}
                            title={t("challenge.start")}
                            onPress={() => void startChallenge(challenge.id)}
                        />
                    </Card>
                ))}
            </Screen>
        );
    }

    if (status === "passed" || status === "failed") {
        return (
            <Screen centered>
                <Text type="title" align="center">
                    {status === "passed"
                        ? t("challenge.passed")
                        : t("challenge.failed")}
                </Text>
                <Text type="subtitle" align="center">
                    {t("challenge.score", {
                        correct,
                        total: questionIds.length,
                    })}
                </Text>
                <Button
                    testID="reset-challenge"
                    title={t("challenge.reset")}
                    onPress={resetChallenge}
                />
            </Screen>
        );
    }

    if (!question) {
        return (
            <Screen centered>
                <Text type="subtitle" align="center">
                    {t("challenge.loading")}
                </Text>
            </Screen>
        );
    }

    const response = responses[question.id];
    const canSubmit = isResponseComplete(question, response);

    return (
        <Screen
            resetKey={question.id}
            footer={
                <Button
                    testID="challenge-submit"
                    title={t("challenge.submit")}
                    disabled={!canSubmit}
                    onPress={() =>
                        advanceChallenge({
                            correct: gradeQuestion(question, response).correct,
                        })
                    }
                />
            }
        >
            <AppBar title={t(definition.labelKey)} />

            <ChallengeTimer
                label={t(definition.labelKey)}
                remainingSeconds={remainingSeconds}
                totalSeconds={definition.durationSeconds}
                answered={index}
                total={questionIds.length}
            />

            <QuestionCard
                question={question}
                response={response}
                maxOptions={PRACTICE_MAX_OPTIONS}
                onRespond={(targetId) => respond({question, targetId})}
            />
        </Screen>
    );
};

export default ChallengeScreen;
