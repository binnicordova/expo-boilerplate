import {render} from "@testing-library/react-native";
import {Divider} from "./Divider";

describe("Divider Component", () => {
    it("renders correctly", () => {
        const {getByTestId} = render(<Divider testID="divider" />);
        expect(getByTestId("divider")).toBeTruthy();
    });

    it("applies custom color", () => {
        const {getByTestId} = render(<Divider color="red" testID="divider" />);
        const divider = getByTestId("divider");
        expect(divider.props.style).toContainEqual(
            expect.objectContaining({backgroundColor: "red"})
        );
    });
});
