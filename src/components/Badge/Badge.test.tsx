import {render} from "@testing-library/react-native";
import {Badge} from "./Badge";

describe("Badge Component", () => {
    it("renders label correctly", () => {
        const {getByText} = render(<Badge label="New" />);
        expect(getByText("New")).toBeTruthy();
    });

    it("renders numeric label", () => {
        const {getByText} = render(<Badge label={99} />);
        expect(getByText("99")).toBeTruthy();
    });

    it("applies variant styles", () => {
        const {getByTestId} = render(
            <Badge label="Status" variant="primary" testID="badge" />
        );
        const badge = getByTestId("badge");
        expect(badge).toBeTruthy();
    });
});
