import {render} from "@testing-library/react-native";
import {Spinner} from "./Spinner";

describe("Spinner Component", () => {
    it("renders correctly", () => {
        const {getByTestId} = render(<Spinner />);
        expect(getByTestId("spinner")).toBeTruthy();
    });

    it("applies custom color", () => {
        const {getByTestId} = render(<Spinner color="red" />);
        const spinner = getByTestId("spinner");
        expect(spinner.props.color).toBe("red");
    });
});
