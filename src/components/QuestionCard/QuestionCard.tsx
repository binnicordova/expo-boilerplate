import {useMemo} from "react";
import {View} from "react-native";
import {
    AnswerOption,
    type AnswerOptionState,
} from "@/components/AnswerOption/AnswerOption";
import {CodeBlock} from "@/components/CodeBlock/CodeBlock";
import {Text} from "@/components/Text/Text";
import {DIFFICULTY_LABEL, DOMAIN_LABEL} from "@/constants/assessment";
import type {AssessmentQuestion, AssessmentResponse} from "@/models/assessment";
import {isOrderingQuestion} from "@/models/assessment";
import {theme} from "@/theme/colors";
import {shuffleWithSeed} from "@/utils/adaptive";
import {styles} from "./QuestionCard.styles";

export type QuestionCardProps = {
    question: AssessmentQuestion;
    response?: AssessmentResponse;
    correctIds?: string[];
    revealed?: boolean;
    shuffleSeed?: string;
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
    onRespond,
}: QuestionCardProps) => {
    const {accent, lightness, darkness, text} = theme();
    const seed = shuffleSeed ?? question.id;

    const alternatives = useMemo(
        () =>
            isOrderingQuestion(question)
                ? []
                : shuffleWithSeed(question.alternatives, seed),
        [question, seed]
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
        <View
            style={[
                styles.container,
                {borderColor: accent, backgroundColor: lightness},
            ]}
        >
            <View style={styles.meta}>
                <Text
                    type="caption"
                    style={[styles.metaLabel, {color: accent}]}
                >
                    {DOMAIN_LABEL[question.domain]}
                </Text>
                <Text type="caption" style={{color: text}}>
                    {DIFFICULTY_LABEL[question.difficulty]}
                </Text>
            </View>

            <Text type="subtitle" style={{color: darkness}}>
                {question.prompt}
            </Text>

            {question.format === "architecture-tradeoff" && (
                <View style={[styles.scenario, {borderLeftColor: accent}]}>
                    <Text type="label" style={{color: text}}>
                        {question.scenario}
                    </Text>
                </View>
            )}

            {question.format === "code-analysis" && (
                <CodeBlock snippet={question.snippet} />
            )}

            <Text type="caption" style={[styles.hint, {color: text}]}>
                {FORMAT_HINT[question.format]}
            </Text>

            <View style={styles.options}>
                {isOrderingQuestion(question)
                    ? steps.map((step) => {
                          const position = orderedIds.indexOf(step.id);
                          const isSelected = position >= 0;

                          return (
                              <AnswerOption
                                  key={step.id}
                                  label={step.text}
                                  marker={isSelected ? `${position + 1}` : "•"}
                                  state={resolveState({
                                      isSelected,
                                      isCorrect:
                                          correctIds[position] === step.id,
                                      revealed,
                                  })}
                                  disabled={revealed}
                                  onPress={() => onRespond(step.id)}
                              />
                          );
                      })
                    : alternatives.map((alternative) => (
                          <AnswerOption
                              key={alternative.id}
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
                              onPress={() => onRespond(alternative.id)}
                          />
                      ))}
            </View>
        </View>
    );
};
