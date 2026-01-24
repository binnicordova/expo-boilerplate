import {render} from "@testing-library/react-native";
import {Avatar} from "./Avatar";

describe("Avatar Component", () => {
    it("renders initials when no image uri is provided", () => {
        const {getByText} = render(<Avatar name="John Doe" />);
        expect(getByText("JD")).toBeTruthy();
    });

    it("renders single initial for single word name", () => {
        const {getByText} = render(<Avatar name="John" />);
        expect(getByText("JO")).toBeTruthy();
    });

    it("renders image when uri is provided", () => {
        const testUri = "https://example.com/avatar.png";
        const {getByTestId} = render(<Avatar uri={testUri} />);
        const image = getByTestId("avatar-image");
        expect(image.props.source.uri).toBe(testUri);
    });

    it("applies custom size", () => {
        const {getByTestId} = render(
            <Avatar name="Test" size={60} testID="avatar" />
        );
        const avatar = getByTestId("avatar");
        expect(avatar.props.style).toContainEqual(
            expect.objectContaining({width: 60, height: 60})
        );
    });
});
