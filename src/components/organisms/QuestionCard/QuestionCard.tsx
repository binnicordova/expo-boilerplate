import {Column, Row, Spacer} from "@expo/ui";
import {useMemo} from "react";
import {Text} from "@/components/atoms/Text/Text";
import {
    AnswerOption,
    type AnswerOptionState,
} from "@/components/molecules/AnswerOption/AnswerOption";
import {Card} from "@/components/molecules/Card/Card";
import {CodeBlock} from "@/components/molecules/CodeBlock/CodeBlock";
import {DIFFICULTY_LABEL, DOMAIN_LABEL} from "@/constants/assessment";
import type {AssessmentQuestion, AssessmentResponse} from "@/models/assessment";
import {isOrderingQuestion} from "@/models/assessment";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";
import {shuffleWithSeed} from "@/utils/adaptive";
import {narrowAlternatives} from "@/utils/options";
import {optionList, scenario as scenarioStyle} from "./QuestionCard.styles";

export type QuestionCardProps = {
    question: AssessmentQuestion;
    response?: AssessmentResponse;
    correctIds?: string[];
    revealed?: boolean;
    shuffleSeed?: string;
    maxOptions?: number;
    onRespond: (targetId: string) => void;
};

const FORMAT_HINT: Record<AssessmentQuestion["format"], string> = {
    "multiple-choice": "Choose the best answer.",
    "multiple-select": "Select every answer that applies.",
    "code-analysis": "Read the snippet, then choose the best answer.",
    "architecture-tradeoff": "Weigh the trade-offs, then choose one design.",
    ordering: "Tap the steps in order. Tap again to remove.",
};

const resolveState = (payload: {
    isSelected: boolean;
    isCorrect: boolean;
    revealed: boolean;
}): AnswerOptionState => {
    if (!payload.revealed) {
        return payload.isSelected ? "selected" : "idle";
    }

    if (payload.isSelected) {
        return payload.isCorrect ? "correct" : "incorrect";
    }

    return payload.isCorrect ? "missed" : "idle";
};

export const QuestionCard = ({
    question,
    response,
    correctIds = [],
    revealed = false,
    shuffleSeed,
    maxOptions,
    onRespond,
}: QuestionCardProps) => {
    const {accent, darkness, text} = useTheme();
    const seed = shuffleSeed ?? question.id;

    const alternatives = useMemo(
        () =>
            isOrderingQuestion(question)
                ? []
                : shuffleWithSeed(
                      narrowAlternatives(
                          question.alternatives,
                          `${seed}:shortlist`,
                          maxOptions
                      ),
                      seed
                  ),
        [question, seed, maxOptions]
    );

    const steps = useMemo(
        () =>
            isOrderingQuestion(question)
                ? shuffleWithSeed(question.steps, seed)
                : [],
        [question, seed]
    );

    const selectedIds =
        response?.kind === "selection" ? response.selectedIds : [];
    const orderedIds = response?.kind === "ordering" ? response.orderedIds : [];

    return (
        <Card testID="question-card">
            <Row alignment="center" style={{width: "100%"}}>
                <Text type="caption" color={accent}>
                    {DOMAIN_LABEL[question.domain]}
                </Text>
                <Spacer flexible />
                <Text type="caption" color={text}>
                    {DIFFICULTY_LABEL[question.difficulty]}
                </Text>
            </Row>

            <Text type="subtitle" color={darkness}>
                {question.prompt}
            </Text>

            {question.format === "architecture-tradeoff" && (
                <Column style={scenarioStyle(accent)}>
                    <Text type="label" color={text}>
                        {question.scenario}
                    </Text>
                </Column>
            )}

            {question.format === "code-analysis" && (
                <CodeBlock snippet={question.snippet} />
            )}

            <Text type="caption" color={text}>
                {FORMAT_HINT[question.format]}
            </Text>

            <Column spacing={SPACING[2]} style={optionList}>
                {isOrderingQuestion(question)
                    ? steps.map((step) => {
                          const position = orderedIds.indexOf(step.id);
                          const isSelected = position >= 0;

                          return (
                              <AnswerOption
                                  key={step.id}
                                  testID={`option-${step.id}`}
                                  label={step.text}
                                  marker={isSelected ? `${position + 1}` : "•"}
                                  state={resolveState({
                                      isSelected,
                                      isCorrect:
                                          correctIds[position] === step.id,
                                      revealed,
                                  })}
                                  disabled={revealed}
                                  onPress={
                                      revealed
                                          ? undefined
                                          : () => onRespond(step.id)
                                  }
                              />
                          );
                      })
                    : alternatives.map((alternative) => (
                          <AnswerOption
                              key={alternative.id}
                              testID={`option-${alternative.id}`}
                              label={alternative.text}
                              state={resolveState({
                                  isSelected: selectedIds.includes(
                                      alternative.id
                                  ),
                                  isCorrect: correctIds.includes(
                                      alternative.id
                                  ),
                                  revealed,
                              })}
                              disabled={revealed}
                              onPress={
                                  revealed
                                      ? undefined
                                      : () => onRespond(alternative.id)
                              }
                          />
                      ))}
            </Column>
        </Card>
    );
};
