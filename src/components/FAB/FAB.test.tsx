import {fireEvent, render} from "@testing-library/react-native";
import {FAB} from "./FAB";

describe("FAB Component", () => {
    it("renders correctly with icon", () => {
        const {getByTestId} = render(
            <FAB icon="plus" onPress={() => {}} testID="fab" />
        );
        expect(getByTestId("fab")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPress = jest.fn();
        const {getByTestId} = render(
            <FAB icon="plus" onPress={onPress} testID="fab" />
        );
        fireEvent.press(getByTestId("fab"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
