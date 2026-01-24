import {render} from "@testing-library/react-native";
import {Text} from "react-native";
import {Card} from "./Card";

describe("Card Component", () => {
    it("renders children correctly", () => {
        const {getByText} = render(
            <Card>
                <Text>Card Content</Text>
            </Card>
        );
        expect(getByText("Card Content")).toBeTruthy();
    });

    it("applies shadow styles when withShadow is true", () => {
        const {getByTestId} = render(
            <Card withShadow={true} testID="card">
                <Text>Content</Text>
            </Card>
        );
        const card = getByTestId("card");
        expect(card.props.style).toContainEqual(
            expect.objectContaining({elevation: 4})
        );
    });
});
