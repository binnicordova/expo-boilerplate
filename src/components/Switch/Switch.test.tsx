import {fireEvent, render} from "@testing-library/react-native";
import {Switch} from "./Switch";

describe("Switch Component", () => {
    it("renders correctly with label", () => {
        const {getByText} = render(
            <Switch label="Notifications" value={false} />
        );
        expect(getByText("Notifications")).toBeTruthy();
    });

    it("calls onValueChange when toggled", () => {
        const onValueChangeMock = jest.fn();
        const {getByRole} = render(
            <Switch value={false} onValueChange={onValueChangeMock} />
        );

        fireEvent(getByRole("switch"), "onValueChange", true);
        expect(onValueChangeMock).toHaveBeenCalledWith(true);
    });
});
