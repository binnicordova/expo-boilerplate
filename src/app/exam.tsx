import {Column, Row, Spacer} from "@expo/ui";
import {useRouter} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/atoms/Button/Button";
import {Text} from "@/components/atoms/Text/Text";
import {AppBar} from "@/components/molecules/AppBar/AppBar";
import {ChallengeTimer} from "@/components/molecules/ChallengeTimer/ChallengeTimer";
import {QuestionCard} from "@/components/organisms/QuestionCard/QuestionCard";
import {ReadinessCard} from "@/components/organisms/ReadinessCard/ReadinessCard";
import {Screen} from "@/components/templates/Screen/Screen";
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
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";
import {isResponseComplete} from "@/utils/grading";

const FULL_WIDTH = {width: "100%"} as const;

const ExamScreen = () => {
    const {accent, darkness, error, text} = useTheme();
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
                    {`${EXAM_LENGTH} questions · ${Math.round(EXAM_DURATION_SECONDS / 60)} minutes · ${Math.round(PASS_OVERALL * 100)}% to pass. Explanations stay hidden until you submit.`}
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
                    color={attempt.passed ? accent : error}
                    align="center"
                >
                    {attempt.passed ? "Certified" : "Not this time"}
                </Text>

                <Text type="subtitle" align="center">
                    {`${attempt.score} / ${attempt.total} · ${attempt.percentage}%`}
                </Text>

                {attempt.timedOut && (
                    <Text type="caption" align="center">
                        The time limit was reached before you submitted.
                    </Text>
                )}

                <Column spacing={SPACING[2]} style={FULL_WIDTH}>
                    {attempt.byDomain.map((entry) => (
                        <Row
                            key={entry.domain}
                            alignment="center"
                            style={FULL_WIDTH}
                        >
                            <Text type="label" color={darkness}>
                                {DOMAIN_LABEL[entry.domain]}
                            </Text>
                            <Spacer flexible />
                            <Text type="label" color={text}>
                                {`${entry.correct}/${entry.answered}`}
                            </Text>
                        </Row>
                    ))}
                </Column>

                {attempt.failureReasons.map((reason) => (
                    <Text key={reason} type="caption" color={error}>
                        {reason}
                    </Text>
                ))}

                {attempt.passed ? (
                    <Button
                        testID="view-certificate"
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
                        testID="back-to-practice"
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
                <Text type="subtitle" align="center">
                    Preparing the exam...
                </Text>
            </Screen>
        );
    }

    const isLast = index >= questionIds.length - 1;

    return (
        <Screen
            resetKey={question.id}
            footer={
                <Row spacing={SPACING[3]} alignment="center">
                    <Button
                        testID="exam-back"
                        title="Back"
                        variant="outlined"
                        disabled={index === 0}
                        onPress={previousQuestion}
                    />
                    <Spacer flexible />
                    <Button
                        testID="exam-next"
                        title={isLast ? "Submit exam" : "Next"}
                        disabled={
                            !isLast &&
                            !isResponseComplete(
                                question,
                                responses[question.id]
                            )
                        }
                        onPress={() =>
                            isLast ? void submitExam() : nextQuestion()
                        }
                    />
                </Row>
            }
        >
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

            <Text type="caption" align="center">
                {`${answeredCount} of ${questionIds.length} answered`}
            </Text>
        </Screen>
    );
};

export default ExamScreen;
