import {fireEvent, render, screen} from "@testing-library/react-native";
import type {ReactTestInstance} from "react-test-renderer";
import {getByUIText} from "@/test-utils/expoUi";
import {AnswerOption} from "./AnswerOption";

type Modifier = {$type: string};

const modifiersOf = (node: ReactTestInstance): string[] =>
    ((node.props as {modifiers?: Modifier[]}).modifiers ?? []).map(
        (modifier) => modifier.$type
    );

const nodesWithModifiers = (root: {
    findAll: ReactTestInstance["findAll"];
}): ReactTestInstance[] =>
    root.findAll(
        (node) =>
            typeof node.type === "string" &&
            Array.isArray((node.props as {modifiers?: unknown[]}).modifiers)
    );

describe("AnswerOption", () => {
    it("renders its label", () => {
        const {root} = render(<AnswerOption label="Answer" />);

        expect(getByUIText(root, "Answer")).toBeTruthy();
    });

    it("reports presses", () => {
        const onPress = jest.fn();
        render(<AnswerOption label="Answer" testID="opt" onPress={onPress} />);

        fireEvent.press(screen.getByTestId("opt"));

        expect(onPress).toHaveBeenCalled();
    });

    /**
     * SwiftUI hit-tests a button's label, not the view the modifiers wrap, so
     * padding applied to the button itself renders a box larger than its tap
     * target. The surface has to live on the label for the whole row to be
     * pressable.
     */
    it("paints the tap surface on the label rather than the button", () => {
        const {root} = render(
            <AnswerOption label="Answer" testID="opt" onPress={jest.fn()} />
        );

        const button = screen.getByTestId("opt");

        expect(modifiersOf(button)).not.toContain("padding");
        expect(modifiersOf(button)).not.toContain("background");

        const label = nodesWithModifiers(root).find((node) =>
            modifiersOf(node).includes("contentShape")
        );

        expect(label).toBeTruthy();
        expect(label).not.toBe(button);
        expect(modifiersOf(label as ReactTestInstance)).toEqual(
            expect.arrayContaining(["padding", "background", "contentShape"])
        );
    });

    it("drops the hit-area shape once the option is locked", () => {
        const {root} = render(
            <AnswerOption label="Answer" testID="opt" disabled />
        );

        const surfaces = nodesWithModifiers(root).flatMap(modifiersOf);

        expect(surfaces).not.toContain("contentShape");
        expect(surfaces).toContain("padding");
    });
});
