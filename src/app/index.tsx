import {BottomSheet, Row} from "@expo/ui";
import {useRouter} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useEffect, useMemo, useState} from "react";
import {Button} from "@/components/atoms/Button/Button";
import {IconButton} from "@/components/atoms/IconButton/IconButton";
import {Surface} from "@/components/atoms/Surface/Surface";
import {Text} from "@/components/atoms/Text/Text";
import {AppBar} from "@/components/molecules/AppBar/AppBar";
import {CheckpointCard} from "@/components/organisms/CheckpointCard/CheckpointCard";
import {MicroLearningCard} from "@/components/organisms/MicroLearningCard/MicroLearningCard";
import {NotificationOptIn} from "@/components/organisms/NotificationOptIn/NotificationOptIn";
import {ProgressHeader} from "@/components/organisms/ProgressHeader/ProgressHeader";
import {QuestionCard} from "@/components/organisms/QuestionCard/QuestionCard";
import {ReadinessCard} from "@/components/organisms/ReadinessCard/ReadinessCard";
import {Screen} from "@/components/templates/Screen/Screen";
import {PRACTICE_MAX_OPTIONS} from "@/constants/assessment";
import {CHECKPOINT_INTERVAL} from "@/constants/certification";
import {PATHS} from "@/constants/routes";
import {cooldownAtom, readinessAtom} from "@/stores/certification";
import {
    notificationPermissionAtom,
    requestNotificationsAtom,
    setNotificationsEnabledAtom,
} from "@/stores/notifications";
import {
    badgesAtom,
    levelAtom,
    levelProgressAtom,
    xpAtom,
} from "@/stores/progression";
import {
    correctIdsAtom,
    fetchQuestionAtom,
    questionAtom,
    questionErrorAtom,
    respondAtom,
    responseByQuestionAtom,
    revealedQuestionsAtom,
} from "@/stores/question";
import {
    checkpointAtom,
    currentQuestionIndexAtom,
    dismissCheckpointAtom,
    goToNextQuestionAtom,
    initializeQuizAtom,
    lastFeedbackAtom,
    quizAtom,
    quizErrorAtom,
    quizStatusAtom,
    submitAnswerAtom,
} from "@/stores/quiz";
import {
    activeStreakAtom,
    dailyGoalAtom,
    dueReviewsAtom,
} from "@/stores/retention";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";
import {isResponseComplete} from "@/utils/grading";

const HomeScreen = () => {
    const question = useAtomValue(questionAtom);
    const questionError = useAtomValue(questionErrorAtom);
    const responses = useAtomValue(responseByQuestionAtom);
    const revealed = useAtomValue(revealedQuestionsAtom);
    const correctIds = useAtomValue(correctIdsAtom);

    const quizIds = useAtomValue(quizAtom);
    const quizStatus = useAtomValue(quizStatusAtom);
    const quizError = useAtomValue(quizErrorAtom);
    const currentQuestionIndex = useAtomValue(currentQuestionIndexAtom);
    const feedback = useAtomValue(lastFeedbackAtom);
    const checkpoint = useAtomValue(checkpointAtom);

    const level = useAtomValue(levelAtom);
    const xp = useAtomValue(xpAtom);
    const levelProgress = useAtomValue(levelProgressAtom);
    const badges = useAtomValue(badgesAtom);
    const streak = useAtomValue(activeStreakAtom);
    const dueReviews = useAtomValue(dueReviewsAtom);
    const dailyGoal = useAtomValue(dailyGoalAtom);
    const readiness = useAtomValue(readinessAtom);
    const cooldown = useAtomValue(cooldownAtom);
    const notificationPermission = useAtomValue(notificationPermissionAtom);

    const initializeQuiz = useSetAtom(initializeQuizAtom);
    const fetchQuestion = useSetAtom(fetchQuestionAtom);
    const respond = useSetAtom(respondAtom);
    const submitAnswer = useSetAtom(submitAnswerAtom);
    const goToNextQuestion = useSetAtom(goToNextQuestionAtom);
    const dismissCheckpoint = useSetAtom(dismissCheckpointAtom);
    const requestNotifications = useSetAtom(requestNotificationsAtom);
    const setNotificationsEnabled = useSetAtom(setNotificationsEnabledAtom);
    const router = useRouter();
    const {surface} = useTheme();

    const [dismissedDigestFor, setDismissedDigestFor] = useState<string | null>(
        null
    );

    const currentQuestionId = quizIds[currentQuestionIndex];
    const response = question ? responses[question.id] : undefined;
    const isRevealed = Boolean(question && revealed.includes(question.id));

    const canSubmit = useMemo(
        () => Boolean(question && isResponseComplete(question, response)),
        [question, response]
    );

    useEffect(() => {
        if (quizStatus === "idle") {
            void initializeQuiz();
        }
    }, [quizStatus, initializeQuiz]);

    useEffect(() => {
        void fetchQuestion(currentQuestionId);
    }, [currentQuestionId, fetchQuestion]);

    if (quizStatus === "loading") {
        return (
            <Screen centered>
                <Text type="title" align="center">
                    Preparing your session...
                </Text>
            </Screen>
        );
    }

    if (quizStatus === "error") {
        return (
            <Screen centered>
                <Text type="error" align="center">
                    {quizError ?? "Could not load."}
                </Text>
                <Button
                    testID="retry-quiz"
                    title="Try again"
                    onPress={() => void initializeQuiz()}
                />
            </Screen>
        );
    }

    if (checkpoint) {
        return (
            <Screen>
                <AppBar title="Checkpoint" />

                <ProgressHeader
                    level={level}
                    xp={xp}
                    levelProgress={levelProgress}
                    streak={streak}
                    dueReviews={dueReviews.length}
                    dailyGoal={dailyGoal}
                    badges={badges}
                />

                <CheckpointCard
                    checkpoint={checkpoint}
                    nextMilestone={CHECKPOINT_INTERVAL}
                    onContinue={() => {
                        dismissCheckpoint();
                        void goToNextQuestion();
                    }}
                    onStop={() => router.push(PATHS.SKILLS)}
                />

                {notificationPermission === false && (
                    <NotificationOptIn
                        streak={streak}
                        onEnable={() => void requestNotifications()}
                        onDismiss={() => void setNotificationsEnabled(false)}
                    />
                )}

                <ReadinessCard
                    readiness={readiness}
                    cooldown={cooldown}
                    onStart={() => router.push(PATHS.EXAM)}
                />
            </Screen>
        );
    }

    if (questionError) {
        return (
            <Screen centered>
                <Text type="error" align="center">
                    {questionError}
                </Text>
                <Button
                    testID="reload-question"
                    title="Reload question"
                    onPress={() => void fetchQuestion(currentQuestionId)}
                />
            </Screen>
        );
    }

    if (!question) {
        return (
            <Screen centered>
                <Text type="subtitle" align="center">
                    No question available.
                </Text>
            </Screen>
        );
    }

    return (
        <Screen
            bottomAligned
            resetKey={question.id}
            header={
                <>
                    <AppBar
                        title="Practice"
                        actions={() => (
                            <Row alignment="center" spacing={SPACING[2]}>
                                <IconButton
                                    name="certificate"
                                    onPress={() => router.push(PATHS.EXAM)}
                                />
                                <IconButton
                                    name="skills"
                                    onPress={() => router.push(PATHS.SKILLS)}
                                />
                                <IconButton
                                    name="timer"
                                    onPress={() => router.push(PATHS.CHALLENGE)}
                                />
                            </Row>
                        )}
                    />

                    <ProgressHeader
                        level={level}
                        xp={xp}
                        levelProgress={levelProgress}
                        streak={streak}
                        dueReviews={dueReviews.length}
                        dailyGoal={dailyGoal}
                        badges={badges}
                    />
                </>
            }
            footer={
                <Button
                    testID="primary-action"
                    title={isRevealed ? "Next question" : "Check answer"}
                    disabled={!isRevealed && !canSubmit}
                    onPress={() =>
                        isRevealed
                            ? void goToNextQuestion()
                            : void submitAnswer(question)
                    }
                />
            }
        >
            <QuestionCard
                question={question}
                response={response}
                correctIds={correctIds}
                revealed={isRevealed}
                maxOptions={PRACTICE_MAX_OPTIONS}
                onRespond={(targetId) => respond({question, targetId})}
            />

            {feedback && (
                <BottomSheet
                    testID="digest-sheet"
                    isPresented={
                        isRevealed && dismissedDigestFor !== question.id
                    }
                    onDismiss={() => setDismissedDigestFor(question.id)}
                    showDragIndicator
                    contentPadding={0}
                >
                    <Surface
                        fill
                        spacing={SPACING[4]}
                        padding={SPACING[4]}
                        backgroundColor={surface}
                    >
                        <MicroLearningCard
                            variant="plain"
                            digest={question.digest}
                            correct={feedback.correct}
                            xpAwarded={feedback.xpAwarded}
                        />

                        <Button
                            testID="digest-next"
                            title="Next question"
                            onPress={() => {
                                setDismissedDigestFor(question.id);
                                void goToNextQuestion();
                            }}
                        />
                    </Surface>
                </BottomSheet>
            )}
        </Screen>
    );
};

export default HomeScreen;
