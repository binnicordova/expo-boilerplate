import {useAtomValue, useSetAtom} from "jotai";
import {useCallback, useEffect, useState} from "react";
import {View} from "react-native";
import {AppBar} from "@/components/AppBar/AppBar";
import {Button} from "@/components/Button/Button";
import {ChallengeTimer} from "@/components/ChallengeTimer/ChallengeTimer";
import {QuestionCard} from "@/components/QuestionCard/QuestionCard";
import {Screen} from "@/components/Screen/Screen";
import {Text} from "@/components/Text/Text";
import {useCountdown} from "@/hooks/useCountdown";
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
import {styles} from "@/styles";
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
                <AppBar title="Proof of Skill" />

                <Text type="caption" style={styles.progressText}>
                    Limited-time sprints. Answer fast and keep your accuracy
                    above the pass mark.
                </Text>

                {challenges.map((challenge) => (
                    <View key={challenge.id} style={styles.quizHeader}>
                        <Text type="subtitle">{challenge.label}</Text>
                        <Text type="caption">
                            {challenge.questionCount} questions ·{" "}
                            {challenge.durationSeconds}s · pass at{" "}
                            {challenge.passingStreak}
                        </Text>
                        <Button
                            title="Start"
                            onPress={() => void startChallenge(challenge.id)}
                        />
                    </View>
                ))}
            </Screen>
        );
    }

    if (status === "passed" || status === "failed") {
        return (
            <Screen centered>
                <Text type="title">
                    {status === "passed" ? "Challenge passed" : "Time is up"}
                </Text>
                <Text type="subtitle">
                    {correct} correct of {questionIds.length}
                </Text>
                <Button title="Back to challenges" onPress={resetChallenge} />
            </Screen>
        );
    }

    if (!question) {
        return (
            <Screen centered>
                <Text type="subtitle">Loading challenge...</Text>
            </Screen>
        );
    }

    const response = responses[question.id];
    const canSubmit = isResponseComplete(question, response);

    return (
        <Screen>
            <AppBar title={definition.label} />

            <ChallengeTimer
                label={definition.label}
                remainingSeconds={remainingSeconds}
                totalSeconds={definition.durationSeconds}
                answered={index}
                total={questionIds.length}
            />

            <QuestionCard
                question={question}
                response={response}
                onRespond={(targetId) => respond({question, targetId})}
            />

            <View style={styles.controls}>
                <Button
                    title="Submit"
                    disabled={!canSubmit}
                    style={styles.controlButton}
                    onPress={() =>
                        advanceChallenge({
                            correct: gradeQuestion(question, response).correct,
                        })
                    }
                />
            </View>
        </Screen>
    );
};

export default ChallengeScreen;
