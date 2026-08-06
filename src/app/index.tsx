import {useRouter} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useEffect, useMemo} from "react";
import {ScrollView, View} from "react-native";
import {AppBar} from "@/components/AppBar/AppBar";
import {Button} from "@/components/Button/Button";
import {Text} from "@/components/Text/Text";
import {contentAtom, fetchContentAtom} from "@/stores/content";
import {
    fetchQuestionAtom,
    questionAtom,
    questionErrorAtom,
    selectAlternativeAtom,
    selectedAlternativeByQuestionAtom,
} from "@/stores/question";
import {
    currentQuestionIndexAtom,
    finalizeQuizAtom,
    goToNextQuestionAtom,
    initializeQuizAtom,
    quizAtom,
    quizErrorAtom,
    quizStatusAtom,
} from "@/stores/quiz";
import {ensureUserAtom, userAtom} from "@/stores/user";
import {styles} from "@/styles";
import {theme} from "@/theme/colors";

const HomeScreen = () => {
    const {accent, lightness, background, text, darkness} = theme();
    const question = useAtomValue(questionAtom);
    const questionError = useAtomValue(questionErrorAtom);
    const content = useAtomValue(contentAtom);
    const selectedAlternatives = useAtomValue(
        selectedAlternativeByQuestionAtom
    );

    const quizIds = useAtomValue(quizAtom);
    const quizStatus = useAtomValue(quizStatusAtom);
    const quizError = useAtomValue(quizErrorAtom);
    const currentQuestionIndex = useAtomValue(currentQuestionIndexAtom);

    const initializeQuiz = useSetAtom(initializeQuizAtom);
    const fetchQuestion = useSetAtom(fetchQuestionAtom);
    const fetchContent = useSetAtom(fetchContentAtom);
    const selectAlternative = useSetAtom(selectAlternativeAtom);
    const goToNextQuestion = useSetAtom(goToNextQuestionAtom);
    const finalizeQuiz = useSetAtom(finalizeQuizAtom);
    const ensureUser = useSetAtom(ensureUserAtom);
    const user = useAtomValue(userAtom);
    const router = useRouter();

    const totalQuestions = quizIds.length;
    const currentQuestionId = quizIds[currentQuestionIndex];
    const selectedAlternativeId = question
        ? selectedAlternatives[question.id]
        : undefined;

    const progressLabel = useMemo(() => {
        if (!totalQuestions) {
            return "0 / 0";
        }

        return `${currentQuestionIndex + 1} / ${totalQuestions}`;
    }, [currentQuestionIndex, totalQuestions]);

    const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

    useEffect(() => {
        ensureUser();
    }, [ensureUser]);

    useEffect(() => {
        if (quizStatus === "idle") {
            void initializeQuiz();
        }
    }, [quizStatus, initializeQuiz]);

    useEffect(() => {
        if (!currentQuestionId) return;
        void fetchQuestion(currentQuestionId);
    }, [currentQuestionId, fetchQuestion]);

    useEffect(() => {
        if (!question?.question_id) return;
        void fetchContent(question.question_id);
    }, [fetchContent, question?.question_id]);

    if (quizStatus === "loading") {
        return (
            <View style={styles.centeredState}>
                <Text type="title">Preparing your quiz...</Text>
            </View>
        );
    }

    if (quizStatus === "error") {
        return (
            <View style={styles.centeredState}>
                <Text type="error">{quizError ?? "Could not load quiz."}</Text>
                <Button
                    title="Try again"
                    onPress={() => void initializeQuiz()}
                />
            </View>
        );
    }

    if (questionError) {
        return (
            <View style={styles.centeredState}>
                <Text type="error">{questionError}</Text>
                <Button
                    title="Reload question"
                    onPress={() =>
                        currentQuestionId &&
                        void fetchQuestion(currentQuestionId)
                    }
                />
            </View>
        );
    }

    if (!question) {
        return (
            <View style={styles.centeredState}>
                <Text type="subtitle">No question available.</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.scroll}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={[
                styles.quizContainer,
                {flexGrow: 1, alignItems: "center"},
            ]}
        >
            <View style={styles.quizContent}>
                <AppBar title="Quiz Challenge" />

                <View style={styles.quizHeader}>
                    <Text type="label" style={styles.progressText}>
                        Question {progressLabel}
                    </Text>
                    <Text type="caption" style={styles.progressText}>
                        One page at a time. Choose the best answer.
                    </Text>
                </View>

                <View
                    style={[
                        styles.quizCard,
                        {borderColor: accent, backgroundColor: lightness},
                    ]}
                >
                    <Text type="subtitle" style={{color: darkness}}>
                        {question.question}
                    </Text>

                    {content?.title && (
                        <Text
                            type="label"
                            style={[styles.contentTitle, {color: accent}]}
                        >
                            {content?.title}
                        </Text>
                    )}

                    <View style={styles.alternativesList}>
                        {question.alternatives.map((alternative, index) => {
                            const isSelected =
                                selectedAlternativeId === alternative.id;

                            return (
                                <Button
                                    key={alternative.id}
                                    title={`${index + 1}. ${alternative.text}`}
                                    onPress={() =>
                                        selectAlternative({
                                            questionId: question.id,
                                            alternativeId: alternative.id,
                                        })
                                    }
                                    style={[
                                        styles.alternativeButton,
                                        {
                                            backgroundColor: isSelected
                                                ? accent
                                                : background,
                                            borderColor: accent,
                                        },
                                    ]}
                                    textColor={
                                        isSelected ? background : darkness
                                    }
                                />
                            );
                        })}
                    </View>
                </View>

                <View style={styles.controls}>
                    <Button
                        title={isLastQuestion ? "Finish" : "Next"}
                        onPress={() => {
                            if (isLastQuestion) {
                                void finalizeQuiz().then((result) => {
                                    const id = result?.userId || user.id;

                                    if (id) {
                                        router.push(
                                            `/${encodeURIComponent(id)}`
                                        );
                                    }
                                });
                                return;
                            }

                            goToNextQuestion();
                        }}
                        style={styles.controlButton}
                    />
                </View>

                <Text
                    type="caption"
                    style={[styles.progressText, {color: text}]}
                >
                    {Object.keys(selectedAlternatives).length} answered of{" "}
                    {totalQuestions}
                </Text>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
