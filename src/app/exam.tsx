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
import {
    EXAM_DURATION_SECONDS,
    EXAM_LENGTH,
    PASS_OVERALL,
} from "@/constants/certification";
import {useCountdown} from "@/hooks/useCountdown";
import {useTranslation} from "@/i18n";
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
    const {t, tRef} = useTranslation();
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
                <AppBar title={t("exam.title")} />

                <Text type="caption">
                    {t("exam.blurb", {
                        questions: EXAM_LENGTH,
                        minutes: Math.round(EXAM_DURATION_SECONDS / 60),
                        passMark: Math.round(PASS_OVERALL * 100),
                    })}
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
                <AppBar title={t("exam.resultTitle")} />

                <Text
                    type="title"
                    color={attempt.passed ? accent : error}
                    align="center"
                >
                    {attempt.passed ? t("exam.passed") : t("exam.failed")}
                </Text>

                <Text type="subtitle" align="center">
                    {t("exam.score", {
                        score: attempt.score,
                        total: attempt.total,
                        percentage: attempt.percentage,
                    })}
                </Text>

                {attempt.timedOut && (
                    <Text type="caption" align="center">
                        {t("exam.timedOut")}
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
                                {t(`domain.${entry.domain}`)}
                            </Text>
                            <Spacer flexible />
                            <Text type="label" color={text}>
                                {t("exam.domainScore", {
                                    correct: entry.correct,
                                    answered: entry.answered,
                                })}
                            </Text>
                        </Row>
                    ))}
                </Column>

                {attempt.failureReasons.map((reason) => (
                    <Text
                        key={`${reason.key}-${reason.params?.domain ?? ""}`}
                        type="caption"
                        color={error}
                    >
                        {tRef(reason)}
                    </Text>
                ))}

                {attempt.passed ? (
                    <Button
                        testID="view-certificate"
                        title={t("exam.viewCertificate")}
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
                        title={t("exam.backToPractice")}
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
                    {t("exam.preparing")}
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
                        title={t("common.back")}
                        variant="outlined"
                        disabled={index === 0}
                        onPress={previousQuestion}
                    />
                    <Spacer flexible />
                    <Button
                        testID="exam-next"
                        title={isLast ? t("exam.submit") : t("common.next")}
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
            <AppBar title={t("exam.heading")} />

            <ChallengeTimer
                label={t("exam.position", {
                    current: index + 1,
                    total: questionIds.length,
                })}
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
                {t("exam.answered", {
                    answered: answeredCount,
                    total: questionIds.length,
                })}
            </Text>
        </Screen>
    );
};

export default ExamScreen;
