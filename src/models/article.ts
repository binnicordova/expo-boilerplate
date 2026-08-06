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
