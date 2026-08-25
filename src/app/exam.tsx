import {useRouter} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useCallback, useEffect, useState} from "react";
import {View} from "react-native";
import {AppBar} from "@/components/AppBar/AppBar";
import {Button} from "@/components/Button/Button";
import {ChallengeTimer} from "@/components/ChallengeTimer/ChallengeTimer";
import {QuestionCard} from "@/components/QuestionCard/QuestionCard";
import {ReadinessCard} from "@/components/ReadinessCard/ReadinessCard";
import {Screen} from "@/components/Screen/Screen";
import {Text} from "@/components/Text/Text";
import {DOMAIN_LABEL} from "@/constants/assessment";
import {
    EXAM_DURATION_SECONDS,
    EXAM_LENGTH,
    PASS_OVERALL,
} from "@/constants/certification";
import {useCountdown} from "@/hooks/useCountdown";
import type {AssessmentQuestion} from "@/models/assessment";
import {api} from "@/services/api";
import {
    cooldownAtom,
    examDeadlineAtom,
    examIndexAtom,
    examQuestionIdsAtom,
    examStartedAtAtom,
    examStatusAtom,
    goToNextExamQuestionAtom,
    goToPreviousExamQuestionAtom,
    lastAttemptAtom,
    readinessAtom,
    resetExamAtom,
    startExamAtom,
    submitExamAtom,
} from "@/stores/certification";
import {respondAtom, responseByQuestionAtom} from "@/stores/question";
import {styles} from "@/styles";
import {theme} from "@/theme/colors";
import {isResponseComplete} from "@/utils/grading";

const ExamScreen = () => {
    const {accent, darkness, error, text} = theme();
    const router = useRouter();

    const status = useAtomValue(examStatusAtom);
    const questionIds = useAtomValue(examQuestionIdsAtom);
    const index = useAtomValue(examIndexAtom);
    const deadline = useAtomValue(examDeadlineAtom);
    const startedAt = useAtomValue(examStartedAtAtom);
    const responses = useAtomValue(responseByQuestionAtom);
    const readiness = useAtomValue(readinessAtom);
    const cooldown = useAtomValue(cooldownAtom);
    const attempt = useAtomValue(lastAttemptAtom);

    const startExam = useSetAtom(startExamAtom);
    const submitExam = useSetAtom(submitExamAtom);
    const nextQuestion = useSetAtom(goToNextExamQuestionAtom);
    const previousQuestion = useSetAtom(goToPreviousExamQuestionAtom);
    const resetExam = useSetAtom(resetExamAtom);
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
        void submitExam({timedOut: true});
    }, [submitExam]);

    const {remainingSeconds} = useCountdown(
        status === "running" ? deadline : null,
        handleExpire
    );

    const answeredCount = questionIds.filter((id) => responses[id]).length;

    if (status === "idle" || status === "loading" || status === "error") {
        return (
            <Screen>
                <AppBar title="Certification" />

                <Text type="caption">
                    {EXAM_LENGTH} questions ·{" "}
                    {Math.round(EXAM_DURATION_SECONDS / 60)} minutes ·{" "}
                    {Math.round(PASS_OVERALL * 100)}% to pass. Explanations stay
                    hidden until you submit.
                </Text>

                <ReadinessCard
                    readiness={readiness}
                    cooldown={cooldown}
                    onStart={() => void startExam()}
                />
            </Screen>
        );
    }

    if (status === "complete" && attempt) {
        return (
            <Screen>
                <AppBar title="Exam result" />

                <Text
                    type="title"
                    style={{
                        color: attempt.passed ? accent : error,
                        textAlign: "center",
                    }}
                >
                    {attempt.passed ? "Certified" : "Not this time"}
                </Text>

                <Text type="subtitle" style={styles.progressText}>
                    {attempt.score} / {attempt.total} · {attempt.percentage}%
                </Text>

                {attempt.timedOut && (
                    <Text type="caption" style={styles.progressText}>
                        The time limit was reached before you submitted.
                    </Text>
                )}

                {attempt.byDomain.map((entry) => (
                    <View key={entry.domain} style={styles.controls}>
                        <Text type="label" style={{color: darkness}}>
                            {DOMAIN_LABEL[entry.domain]}
                        </Text>
                        <Text type="label" style={{color: text}}>
                            {entry.correct}/{entry.answered}
                        </Text>
                    </View>
                ))}

                {attempt.failureReasons.map((reason) => (
                    <Text key={reason} type="caption" style={{color: error}}>
                        {reason}
                    </Text>
                ))}

                {attempt.passed ? (
                    <Button
                        title="View certificate"
                        onPress={() => {
                            resetExam();
                            router.push(
                                `/${encodeURIComponent(attempt.userId)}`
                            );
                        }}
                    />
                ) : (
                    <Button
                        title="Back to practice"
                        onPress={() => {
                            resetExam();
                            router.replace("/");
                        }}
                    />
                )}
            </Screen>
        );
    }

    if (!question) {
        return (
            <Screen centered>
                <Text type="subtitle">Preparing the exam...</Text>
            </Screen>
        );
    }

    const isLast = index >= questionIds.length - 1;

    return (
        <Screen>
            <AppBar title="Certification exam" />

            <ChallengeTimer
                label={`Question ${index + 1} of ${questionIds.length}`}
                remainingSeconds={remainingSeconds}
                totalSeconds={EXAM_DURATION_SECONDS}
                answered={answeredCount}
                total={questionIds.length}
            />

            <QuestionCard
                question={question}
                response={responses[question.id]}
                shuffleSeed={`${startedAt ?? "exam"}-${question.id}`}
                onRespond={(targetId) => respond({question, targetId})}
            />

            <View style={styles.controls}>
                <Button
                    title="Back"
                    disabled={index === 0}
                    style={styles.controlButton}
                    onPress={previousQuestion}
                />
                <Button
                    title={isLast ? "Submit exam" : "Next"}
                    disabled={
                        !isLast &&
                        !isResponseComplete(question, responses[question.id])
                    }
                    style={styles.controlButton}
                    onPress={() =>
                        isLast ? void submitExam() : nextQuestion()
                    }
                />
            </View>

            <Text type="caption" style={styles.progressText}>
                {answeredCount} of {questionIds.length} answered
            </Text>
        </Screen>
    );
};

export default ExamScreen;
