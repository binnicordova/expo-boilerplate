import {render} from "@testing-library/react-native";
import {useEffect} from "react";
import {Text} from "@/components/atoms/Text/Text";
import {getByUIText, queryByUIText} from "@/test-utils/expoUi";
import {Screen} from "./Screen";

const Mounted = ({onMount}: {onMount: () => void}) => {
    useEffect(onMount, [onMount]);
    return <Text>content</Text>;
};

describe("Screen", () => {
    it("renders its children", () => {
        const {root} = render(
            <Screen>
                <Text>body</Text>
            </Screen>
        );

        expect(getByUIText(root, "body")).toBeTruthy();
    });

    it("renders a pinned footer alongside the content", () => {
        const {root} = render(
            <Screen footer={<Text>Next question</Text>}>
                <Text>body</Text>
            </Screen>
        );

        expect(getByUIText(root, "body")).toBeTruthy();
        expect(getByUIText(root, "Next question")).toBeTruthy();
    });

    it("omits the footer region when no footer is given", () => {
        const {root} = render(
            <Screen>
                <Text>body</Text>
            </Screen>
        );

        expect(queryByUIText(root, "Next question")).toBeUndefined();
    });

    it("remounts the scroll view when resetKey changes", () => {
        const onMount = jest.fn();

        const {rerender} = render(
            <Screen resetKey="question-1">
                <Mounted onMount={onMount} />
            </Screen>
        );

        expect(onMount).toHaveBeenCalledTimes(1);

        rerender(
            <Screen resetKey="question-2">
                <Mounted onMount={onMount} />
            </Screen>
        );

        expect(onMount).toHaveBeenCalledTimes(2);
    });

    it("keeps the scroll view mounted while resetKey is unchanged", () => {
        const onMount = jest.fn();

        const {rerender} = render(
            <Screen resetKey="question-1">
                <Mounted onMount={onMount} />
            </Screen>
        );

        rerender(
            <Screen resetKey="question-1" footer={<Text>Next question</Text>}>
                <Mounted onMount={onMount} />
            </Screen>
        );

        expect(onMount).toHaveBeenCalledTimes(1);
    });
});
