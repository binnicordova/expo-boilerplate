import {fireEvent, render} from "@testing-library/react-native";
import {Input} from "./Input";

describe("Input Component", () => {
    it("renders correctly with label", () => {
        const {getByText} = render(<Input label="Username" />);
        expect(getByText("Username")).toBeTruthy();
    });

    it("renders error message when error prop is provided", () => {
        const {getByText} = render(<Input error="Required field" />);
        expect(getByText("Required field")).toBeTruthy();
    });

    it("calls onChangeText when text changes", () => {
        const onChangeTextMock = jest.fn();
        const {getByPlaceholderText} = render(
            <Input placeholder="Enter text" onChangeText={onChangeTextMock} />
        );

        fireEvent.changeText(getByPlaceholderText("Enter text"), "Hello");
        expect(onChangeTextMock).toHaveBeenCalledWith("Hello");
    });
});
