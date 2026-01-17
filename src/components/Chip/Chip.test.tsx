import {fireEvent, render} from "@testing-library/react-native";
import {Chip} from "./Chip";

describe("Chip Component", () => {
    it("renders label correctly", () => {
        const {getByText} = render(<Chip label="React Native" />);
        expect(getByText("React Native")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPressMock = jest.fn();
        const {getByText} = render(
            <Chip label="Click Me" onPress={onPressMock} />
        );

        fireEvent.press(getByText("Click Me"));
        expect(onPressMock).toHaveBeenCalled();
    });

    it("calls onClose when close icon is pressed", () => {
        const onCloseMock = jest.fn();
        const {getByTestId} = render(
            <Chip label="Tag" onClose={onCloseMock} />
        );

        fireEvent.press(getByTestId("chip-close-button"));
        expect(onCloseMock).toHaveBeenCalled();
    });
});
