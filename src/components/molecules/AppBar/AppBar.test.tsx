import {fireEvent, render} from "@testing-library/react-native";
import {getByUIText} from "@/test-utils/expoUi";
import {AppBar} from "./AppBar";

const mockGoBack = jest.fn();
const mockNavigation = {canGoBack: false};

jest.mock("expo-router", () => ({
    useNavigation: () => ({
        canGoBack: () => mockNavigation.canGoBack,
        goBack: () => mockGoBack(),
    }),
}));

const TITLE = "Test Title";

describe("AppBar", () => {
    beforeEach(() => {
        mockNavigation.canGoBack = false;
        mockGoBack.mockClear();
    });

    it("renders the title", () => {
        const {root} = render(<AppBar title={TITLE} />);

        expect(getByUIText(root, TITLE)).toBeTruthy();
    });

    it("does not render the back button when navigation cannot go back", () => {
        const {queryByTestId} = render(<AppBar title={TITLE} />);

        expect(queryByTestId("back-button")).toBeNull();
    });

    it("goes back when the back button is pressed", () => {
        mockNavigation.canGoBack = true;

        const {getByTestId} = render(<AppBar title={TITLE} />);
        fireEvent.press(getByTestId("back-button"));

        expect(mockGoBack).toHaveBeenCalled();
    });

    it("renders the supplied actions", () => {
        const {root} = render(
            <AppBar title={TITLE} actions={() => <AppBar title="Action" />} />
        );

        expect(getByUIText(root, "Action")).toBeTruthy();
    });
});
