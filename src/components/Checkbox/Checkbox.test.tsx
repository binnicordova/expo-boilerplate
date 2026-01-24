import {fireEvent, render} from "@testing-library/react-native";
import {Checkbox} from "./Checkbox";

describe("Checkbox Component", () => {
    it("renders correctly with label", () => {
        const {getByText} = render(
            <Checkbox
                checked={false}
                onChange={() => {}}
                label="Accept terms"
            />
        );
        expect(getByText("Accept terms")).toBeTruthy();
    });

    it("calls onChange when pressed", () => {
        const onChangeMock = jest.fn();
        const {getByText} = render(
            <Checkbox
                checked={false}
                onChange={onChangeMock}
                label="Toggle me"
            />
        );

        fireEvent.press(getByText("Toggle me"));
        expect(onChangeMock).toHaveBeenCalledWith(true);
    });

    it("does not call onChange when disabled", () => {
        const onChangeMock = jest.fn();
        const {getByText} = render(
            <Checkbox
                checked={false}
                onChange={onChangeMock}
                label="Toggle me"
                disabled={true}
            />
        );

        fireEvent.press(getByText("Toggle me"));
        expect(onChangeMock).not.toHaveBeenCalled();
    });
});
