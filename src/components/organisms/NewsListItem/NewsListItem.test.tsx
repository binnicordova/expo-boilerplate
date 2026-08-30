import {fireEvent, render} from "@testing-library/react-native";
import type {Article} from "@/models/article";
import {getByUIText} from "@/test-utils/expoUi";
import {NewsListItem} from "./NewsListItem";

describe("NewsListItem", () => {
    const article: Article = {
        objectID: "1",
        story_title: "Test Story",
        story_url: "https://example.com",
        comment_text: "<b>Comment</b>",
        author: "Author",
        created_at: "2025-08-23",
        _tags: [],
        created_at_i: 0,
        parent_id: 0,
        story_id: 0,
        updated_at: "",
    };

    it("renders the story, stripped comment and author", () => {
        const {root} = render(<NewsListItem item={article} />);

        expect(getByUIText(root, "Test Story")).toBeTruthy();
        expect(getByUIText(root, "Comment")).toBeTruthy();
        expect(getByUIText(root, "By Author")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPress = jest.fn();
        const {getByTestId} = render(
            <NewsListItem item={article} onPress={onPress} />
        );

        fireEvent.press(getByTestId("news-list-item"));

        expect(onPress).toHaveBeenCalled();
    });
});
