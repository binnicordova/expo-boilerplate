import {fireEvent, render} from "@testing-library/react-native";
import {Text} from "react-native";
import {Accordion} from "./Accordion";

describe("Accordion", () => {
    it("renders correctly and is collapsed by default", () => {
        const {getByText, queryByText} = render(
            <Accordion title="Accordion Title">
                <Text>Accordion Content</Text>
            </Accordion>
        );

        expect(getByText("Accordion Title")).toBeTruthy();
        expect(queryByText("Accordion Content")).toBeNull();
    });

    it("expands when pressed", () => {
        const {getByText} = render(
            <Accordion title="Accordion Title">
                <Text>Accordion Content</Text>
            </Accordion>
        );

        fireEvent.press(getByText("Accordion Title"));
        expect(getByText("Accordion Content")).toBeTruthy();
    });

    it("is expanded by default if defaultExpanded is true", () => {
        const {getByText} = render(
            <Accordion title="Accordion Title" defaultExpanded={true}>
                <Text>Accordion Content</Text>
            </Accordion>
        );

        expect(getByText("Accordion Content")).toBeTruthy();
    });
});
