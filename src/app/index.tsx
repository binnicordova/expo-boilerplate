import {useRouter} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useEffect, useMemo} from "react";
import {View} from "react-native";
import {AppBar} from "@/components/AppBar/AppBar";
import {Button} from "@/components/Button/Button";
import {CheckpointCard} from "@/components/CheckpointCard/CheckpointCard";
import {Icon} from "@/components/Icon/Icon";
import {MicroLearningCard} from "@/components/MicroLearningCard/MicroLearningCard";
import {NotificationOptIn} from "@/components/NotificationOptIn/NotificationOptIn";
import {ProgressHeader} from "@/components/ProgressHeader/ProgressHeader";
import {QuestionCard} from "@/components/QuestionCard/QuestionCard";
import {ReadinessCard} from "@/components/ReadinessCard/ReadinessCard";
import {Screen} from "@/components/Screen/Screen";
import {Text} from "@/components/Text/Text";
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
    sessionAnsweredAtom,
    submitAnswerAtom,
} from "@/stores/quiz";
import {
    activeStreakAtom,
    dailyGoalAtom,
    dueReviewsAtom,
} from "@/stores/retention";
import {styles} from "@/styles";
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
    const sessionAnswered = useAtomValue(sessionAnsweredAtom);

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
                <Text type="title">Preparing your session...</Text>
            </Screen>
        );
    }

    if (quizStatus === "error") {
        return (
            <Screen centered>
                <Text type="error">{quizError ?? "Could not load."}</Text>
                <Button
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
                <Text type="error">{questionError}</Text>
                <Button
                    title="Reload question"
                    onPress={() => void fetchQuestion(currentQuestionId)}
                />
            </Screen>
        );
    }

    if (!question) {
        return (
            <Screen centered>
                <Text type="subtitle">No question available.</Text>
            </Screen>
        );
    }

    return (
        <Screen>
            <AppBar
                title="Practice"
                actions={() => (
                    <View style={styles.appBarActions}>
                        <Icon
                            name="ribbon-outline"
                            onPress={() => router.push(PATHS.EXAM)}
                        />
                        <Icon
                            name="git-branch-outline"
                            onPress={() => router.push(PATHS.SKILLS)}
                        />
                        <Icon
                            name="timer-outline"
                            onPress={() => router.push(PATHS.CHALLENGE)}
                        />
                    </View>
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

            <QuestionCard
                question={question}
                response={response}
                correctIds={correctIds}
                revealed={isRevealed}
                onRespond={(targetId) => respond({question, targetId})}
            />

            {isRevealed && feedback && (
                <MicroLearningCard
                    digest={question.digest}
                    correct={feedback.correct}
                    xpAwarded={feedback.xpAwarded}
                />
            )}

            <View style={styles.controls}>
                <Button
                    title={isRevealed ? "Next question" : "Check answer"}
                    disabled={!isRevealed && !canSubmit}
                    onPress={() =>
                        isRevealed
                            ? void goToNextQuestion()
                            : void submitAnswer(question)
                    }
                    style={styles.controlButton}
                />
            </View>

            <Text type="caption" style={styles.progressText}>
                {sessionAnswered} answered this session
            </Text>
        </Screen>
    );
};

export default HomeScreen;
