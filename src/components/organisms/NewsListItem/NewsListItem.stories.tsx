import {Host} from "@expo/ui";
import type {Article} from "@/models/article";
import {NewsListItem} from "./NewsListItem";

export default {
    title: "Components/NewsListItem",
    component: NewsListItem,
};

const article: Article = {
    objectID: "1",
    story_title: "Cupertino News Story",
    story_url: "https://example.com",
    comment_text: "<b>This is a comment</b>",
    author: "Jane Doe",
    created_at: "2025-08-23",
    _tags: [],
    created_at_i: 0,
    parent_id: 0,
    story_id: 0,
    updated_at: "",
};

export const Default = () => (
    <Host matchContents>
        <NewsListItem item={article} />
    </Host>
);
