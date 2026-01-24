import {fireEvent, render} from "@testing-library/react-native";
import {RadioButton, RadioGroup} from "./Radio";

describe("Radio Components", () => {
    describe("RadioButton", () => {
        it("renders label correctly", () => {
            const {getByText} = render(
                <RadioButton
                    selected={false}
                    onPress={() => {}}
                    label="Option 1"
                />
            );
            expect(getByText("Option 1")).toBeTruthy();
        });

        it("calls onPress when clicked", () => {
            const onPressMock = jest.fn();
            const {getByText} = render(
                <RadioButton
                    selected={false}
                    onPress={onPressMock}
                    label="Toggle"
                />
            );
            fireEvent.press(getByText("Toggle"));
            expect(onPressMock).toHaveBeenCalled();
        });
    });

    describe("RadioGroup", () => {
        const options = [
            {label: "A", value: "a"},
            {label: "B", value: "b"},
        ];

        it("renders all options", () => {
            const {getByText} = render(
                <RadioGroup
                    options={options}
                    selectedValue="a"
                    onValueChange={() => {}}
                />
            );
            expect(getByText("A")).toBeTruthy();
            expect(getByText("B")).toBeTruthy();
        });

        it("calls onValueChange with correct value", () => {
            const onChangeMock = jest.fn();
            const {getByText} = render(
                <RadioGroup
                    options={options}
                    selectedValue="a"
                    onValueChange={onChangeMock}
                />
            );
            fireEvent.press(getByText("B"));
            expect(onChangeMock).toHaveBeenCalledWith("b");
        });
    });
});
