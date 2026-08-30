import {render} from "@testing-library/react-native";
import {getByUIText} from "@/test-utils/expoUi";
import {Text, type ThemedTextProps} from "./Text";

describe("Text", () => {
    const testCases: ThemedTextProps["type"][] = [
        "default",
        "title",
        "caption",
        "error",
        "label",
    ];

    test.each(testCases)("renders with type '%s'", (type) => {
        const content = "Sample Text";
        const {root} = render(<Text type={type}>{content}</Text>);

        expect(getByUIText(root, content)).toBeTruthy();
    });

    it("applies the requested colour to the text style", () => {
        const {root} = render(<Text color="#FF0000">Coloured</Text>);

        expect(getByUIText(root, "Coloured").props.modifiers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    $type: "foregroundStyle",
                    color: "#FF0000",
                }),
            ])
        );
    });

    it("renders with a custom container style", () => {
        const content = "Custom Style Text";
        const {root} = render(<Text style={{padding: 8}}>{content}</Text>);

        expect(getByUIText(root, content)).toBeTruthy();
    });
});
