import {fireEvent, render} from "@testing-library/react-native";
import {getByUIText} from "@/test-utils/expoUi";
import {Button} from "./Button";

describe("Button", () => {
    it("renders the given title", () => {
        const {root} = render(<Button title="Click Me" />);

        expect(getByUIText(root, "Click Me")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPress = jest.fn();
        const {getByTestId} = render(
            <Button title="Click Me" onPress={onPress} testID="cta" />
        );

        fireEvent.press(getByTestId("cta"));

        expect(onPress).toHaveBeenCalled();
    });

    it("withholds the press handler and disables the native button", () => {
        const onPress = jest.fn();
        const {getByTestId} = render(
            <Button title="Click Me" onPress={onPress} disabled testID="cta" />
        );

        const button = getByTestId("cta");

        expect(button.props.onButtonPress).toBeUndefined();
        expect(button.props.modifiers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({$type: "disabled", disabled: true}),
            ])
        );
    });

    it("maps the outlined variant to a bordered button style", () => {
        const {getByTestId} = render(
            <Button title="Secondary" variant="outlined" testID="cta" />
        );

        expect(getByTestId("cta").props.modifiers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    $type: "buttonStyle",
                    style: "bordered",
                }),
            ])
        );
    });
});
