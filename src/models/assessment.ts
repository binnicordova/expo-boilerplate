import type {Alternative} from "@/models/article";

export type Domain =
    | "react-native"
    | "typescript"
    | "architecture"
    | "node"
    | "react";

export type Difficulty = 0 | 1 | 2;

export type QuestionFormat =
    | "multiple-choice"
    | "multiple-select"
    | "code-analysis"
    | "architecture-tradeoff"
    | "ordering";

export type CodeSnippet = {
    language: "tsx" | "ts" | "js" | "jsx";
    source: string;
};

export type OrderingStep = {
    id: string;
    text: string;
    position: number;
};

export type MicroLearningDigest = {
    headline: string;
    body: string;
    reference?: string;
};

type AssessmentQuestionBase = {
    id: string;
    topicId: string;
    domain: Domain;
    difficulty: Difficulty;
    prompt: string;
    digest: MicroLearningDigest;
};

export type MultipleChoiceQuestion = AssessmentQuestionBase & {
    format: "multiple-choice";
    alternatives: Alternative[];
};

export type MultipleSelectQuestion = AssessmentQuestionBase & {
    format: "multiple-select";
    alternatives: Alternative[];
};

export type CodeAnalysisQuestion = AssessmentQuestionBase & {
    format: "code-analysis";
    snippet: CodeSnippet;
    alternatives: Alternative[];
};

export type ArchitectureTradeOffQuestion = AssessmentQuestionBase & {
    format: "architecture-tradeoff";
    scenario: string;
    alternatives: Alternative[];
};

export type OrderingQuestion = AssessmentQuestionBase & {
    format: "ordering";
    steps: OrderingStep[];
};

export type AssessmentQuestion =
    | MultipleChoiceQuestion
    | MultipleSelectQuestion
    | CodeAnalysisQuestion
    | ArchitectureTradeOffQuestion
    | OrderingQuestion;

export type ChoiceQuestion = Extract<
    AssessmentQuestion,
    {alternatives: Alternative[]}
>;

export type AssessmentResponse =
    | {kind: "selection"; selectedIds: string[]}
    | {kind: "ordering"; orderedIds: string[]};

export type GradeResult = {
    correct: boolean;
    accuracy: number;
    correctIds: string[];
};

export const isChoiceQuestion = (
    question: AssessmentQuestion
): question is ChoiceQuestion => question.format !== "ordering";

export const isOrderingQuestion = (
    question: AssessmentQuestion
): question is OrderingQuestion => question.format === "ordering";
