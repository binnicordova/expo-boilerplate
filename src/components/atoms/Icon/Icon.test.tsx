import {render} from "@testing-library/react-native";
import {getByUIProp} from "@/test-utils/expoUi";
import {Icon} from "./Icon";

describe("Icon", () => {
    it("renders the SF Symbol mapped to the icon name", () => {
        const {root} = render(<Icon name="streak" />);

        expect(getByUIProp(root, "systemName", "flame.fill")).toBeTruthy();
    });

    it("renders a distinct symbol per name", () => {
        const {root} = render(<Icon name="locked" />);

        expect(getByUIProp(root, "systemName", "lock.fill")).toBeTruthy();
    });

    it("applies the requested size and colour as modifiers", () => {
        const {root} = render(
            <Icon name="success" size={24} color="#00FF00" />
        );

        const icon = getByUIProp(root, "systemName", "checkmark.circle.fill");

        expect(icon.props.modifiers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({$type: "font", size: 24}),
                expect.objectContaining({
                    $type: "foregroundStyle",
                    color: "#00FF00",
                }),
            ])
        );
    });
});
