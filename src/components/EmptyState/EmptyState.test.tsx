import {fireEvent, render} from "@testing-library/react-native";
import {EmptyState} from "./EmptyState";

describe("EmptyState Component", () => {
    it("renders title correctly", () => {
        const {getByText} = render(<EmptyState title="No Items" />);
        expect(getByText("No Items")).toBeTruthy();
    });

    it("renders description and icon", () => {
        const {getByText} = render(
            <EmptyState
                title="No Items"
                description="Try searching for something else"
                icon="account"
                testID="empty-state"
            />
        );
        expect(getByText("Try searching for something else")).toBeTruthy();
    });

    it("renders action button and calls onAction", () => {
        const onAction = jest.fn();
        const {getByText} = render(
            <EmptyState title="Error" actionLabel="Retry" onAction={onAction} />
        );

        const button = getByText("Retry");
        fireEvent.press(button);
        expect(onAction).toHaveBeenCalledTimes(1);
    });
});
