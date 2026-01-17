import {fireEvent, render} from "@testing-library/react-native";
import {Text} from "react-native";
import {ListItem} from "./ListItem";

describe("ListItem Component", () => {
    it("renders title and subtitle correctly", () => {
        const {getByText} = render(
            <ListItem title="Settings" subtitle="Manage your account" />
        );
        expect(getByText("Settings")).toBeTruthy();
        expect(getByText("Manage your account")).toBeTruthy();
    });

    it("calls onPress when provided", () => {
        const onPressMock = jest.fn();
        const {getByText} = render(
            <ListItem title="Click Me" onPress={onPressMock} />
        );
        fireEvent.press(getByText("Click Me"));
        expect(onPressMock).toHaveBeenCalled();
    });

    it("renders left component", () => {
        const {getByText} = render(
            <ListItem title="Left" left={<Text>ICON</Text>} />
        );
        expect(getByText("ICON")).toBeTruthy();
    });
});
