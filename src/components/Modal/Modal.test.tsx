import {fireEvent, render} from "@testing-library/react-native";
import {Text} from "react-native";
import {Modal} from "./Modal";

describe("Modal", () => {
    const mockOnClose = jest.fn();

    it("renders correctly when visible", () => {
        const {getByText} = render(
            <Modal visible={true} onClose={mockOnClose} title="Test Modal">
                <Text>Modal content</Text>
            </Modal>
        );

        expect(getByText("Test Modal")).toBeTruthy();
        expect(getByText("Modal content")).toBeTruthy();
    });

    it("does not render when not visible", () => {
        const {queryByText} = render(
            <Modal visible={false} onClose={mockOnClose} title="Test Modal">
                <Text>Modal content</Text>
            </Modal>
        );

        expect(queryByText("Test Modal")).toBeNull();
    });

    it("calls onClose when backdrop is pressed", () => {
        const {getByTestId} = render(
            <Modal visible={true} onClose={mockOnClose}>
                <Text>Modal content</Text>
            </Modal>
        );

        fireEvent.press(getByTestId("modal-overlay"));
        expect(mockOnClose).toHaveBeenCalled();
    });
});
