export interface Alternative {
    id: string;
    text: string;
    is_correct: boolean;
}

export type Question = {
    id: string;
    question_id: string;
    question: string;
    alternatives: Alternative[];
};

export type Article = {
    objectID: string;
    story_id: number;
    story_title: string;
    story_url: string;
    parent_id: number;
    comment_text: string;
    author: string;
    created_at: string;
    created_at_i: number;
    updated_at: string;
    _tags: string[];
};
