import {fireEvent, render} from "@testing-library/react-native";
import type {AssessmentQuestion} from "@/models/assessment";
import {
    getByUIText,
    queryAllByUIText,
    queryByUIText,
    uiTexts,
} from "@/test-utils/expoUi";
import {shuffleWithSeed} from "@/utils/adaptive";
import {QuestionCard} from "./QuestionCard";

const digest = {headline: "headline", body: "body"};

const LONG_TEXT =
    "Export default permite importar con cualquier nombre, mientras que la exportacion nombrada obliga a usar el identificador exacto.";

const multipleChoice: AssessmentQuestion = {
    id: "mc",
    topicId: "mc",
    domain: "react",
    difficulty: 0,
    format: "multiple-choice",
    prompt: "Which statement is true?",
    digest,
    alternatives: [
        {id: "a", text: LONG_TEXT, is_correct: true},
        {id: "b", text: "No hay diferencia.", is_correct: false},
    ],
};

const codeAnalysis: AssessmentQuestion = {
    id: "code",
    topicId: "code",
    domain: "react-native",
    difficulty: 1,
    format: "code-analysis",
    prompt: "What is the defect?",
    digest,
    snippet: {language: "tsx", source: "const value = useMemo(fn, [])"},
    alternatives: [{id: "a", text: "Stale closure", is_correct: true}],
};

const architecture: AssessmentQuestion = {
    id: "arch",
    topicId: "arch",
    domain: "architecture",
    difficulty: 2,
    format: "architecture-tradeoff",
    prompt: "Pick a design",
    scenario: "The client works offline for hours at a time.",
    digest,
    alternatives: [{id: "a", text: "Operation log", is_correct: true}],
};

const ordering: AssessmentQuestion = {
    id: "ord",
    topicId: "ord",
    domain: "node",
    difficulty: 2,
    format: "ordering",
    prompt: "Order the phases",
    digest,
    steps: [
        {id: "s1", text: "Timers", position: 0},
        {id: "s2", text: "Poll", position: 1},
    ],
};

describe("QuestionCard", () => {
    it("renders long alternative text in full without truncation", () => {
        const {root} = render(
            <QuestionCard question={multipleChoice} onRespond={jest.fn()} />
        );

        const label = getByUIText(root, LONG_TEXT);

        expect(label).toBeTruthy();
        expect(label.props.numberOfLines).toBeUndefined();
    });

    it("renders the snippet for a code analysis question", () => {
        const {root} = render(
            <QuestionCard question={codeAnalysis} onRespond={jest.fn()} />
        );

        expect(getByUIText(root, "const value = useMemo(fn, [])")).toBeTruthy();
        expect(getByUIText(root, "tsx")).toBeTruthy();
    });

    it("renders the scenario for an architecture question", () => {
        const {root} = render(
            <QuestionCard question={architecture} onRespond={jest.fn()} />
        );

        expect(
            getByUIText(root, "The client works offline for hours at a time.")
        ).toBeTruthy();
    });

    it("numbers ordering steps as they are picked", () => {
        const {root} = render(
            <QuestionCard
                question={ordering}
                response={{kind: "ordering", orderedIds: ["s2"]}}
                onRespond={jest.fn()}
            />
        );

        expect(getByUIText(root, "1")).toBeTruthy();
        expect(queryAllByUIText(root, "\u2022")).toHaveLength(1);
    });

    it("does not number the answer options", () => {
        const {root} = render(
            <QuestionCard question={multipleChoice} onRespond={jest.fn()} />
        );

        expect(queryByUIText(root, "1")).toBeUndefined();
        expect(queryByUIText(root, "2")).toBeUndefined();
        expect(getByUIText(root, LONG_TEXT)).toBeTruthy();
    });

    it("shuffles the options deterministically per question", () => {
        const manyOptions: AssessmentQuestion = {
            ...multipleChoice,
            id: "shuffle-me",
            alternatives: Array.from({length: 6}, (_, index) => ({
                id: `opt-${index}`,
                text: `option ${index}`,
                is_correct: index === 0,
            })),
        };

        const readOrder = () => {
            const view = render(
                <QuestionCard question={manyOptions} onRespond={jest.fn()} />
            );
            const order = uiTexts(view.root).filter((value) =>
                /^option \d$/.test(value)
            );
            view.unmount();
            return order;
        };

        expect(readOrder()).toHaveLength(6);
        expect(readOrder()).toEqual(readOrder());
    });

    it("does not present options in their authored order", () => {
        const manyOptions: AssessmentQuestion = {
            ...multipleChoice,
            id: "authored-order",
            alternatives: Array.from({length: 8}, (_, index) => ({
                id: `opt-${index}`,
                text: `option ${index}`,
                is_correct: index === 0,
            })),
        };

        const authored = Array.from({length: 8}, (_, index) => ({
            id: `opt-${index}`,
        }));

        const shuffled = shuffleWithSeed(authored, manyOptions.id);

        expect(shuffled.map((entry) => entry.id)).not.toEqual(
            authored.map((entry) => entry.id)
        );
    });

    it("reports the tapped option", () => {
        const onRespond = jest.fn();

        const {getByTestId} = render(
            <QuestionCard question={multipleChoice} onRespond={onRespond} />
        );

        fireEvent.press(getByTestId("option-a"));

        expect(onRespond).toHaveBeenCalledWith("a");
    });

    it("locks the options once the answer is revealed", () => {
        const onRespond = jest.fn();

        const {getByTestId} = render(
            <QuestionCard
                question={multipleChoice}
                response={{kind: "selection", selectedIds: ["b"]}}
                correctIds={["a"]}
                revealed
                onRespond={onRespond}
            />
        );

        fireEvent.press(getByTestId("option-a"));

        expect(onRespond).not.toHaveBeenCalled();
    });
});
