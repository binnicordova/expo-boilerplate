import {CERTIFICATION_SYNC_FUNCTION_URL} from "@/constants/env";
import type {Question} from "@/models/article";
import type {Content} from "@/models/content";
import {http} from "@/services/http";
import content from "./mocks/content.json";
import questions from "./mocks/questions.json";

export type CertificationSyncPayload = {
    userId: string;
    name: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    issuedAt: string;
    validUntil: string | null;
};

type PersistCertificationResponse = {
    ok: boolean;
    userId: string;
    path: string;
};

type API = {
    getContent: (id?: string) => Promise<Content | null>;
    getQuiz: (length?: number) => Promise<string[]>;
    getQuestion: (id?: string) => Promise<Question>;
    persistCertification: (
        payload: CertificationSyncPayload
    ) => Promise<PersistCertificationResponse>;
};

export const api: API = {
    getContent: (id?: string) =>
        Promise.resolve(
            content.find((c) => c.id === id && c.level < 0) || null
        ),
    getQuiz: (length = 5) => {
        // Create a shuffled copy so the mock source array remains stable.
        const ids = [...questions]
            .sort(() => 0.5 - Math.random())
            .slice(0, length)
            .map((q) => q.id);
        return Promise.resolve(ids);
    },
    getQuestion: (id) => {
        const fallbackQuestion = questions[0];
        const question = id
            ? questions.find((q) => q.id === id)
            : fallbackQuestion;

        if (!question) {
            return Promise.reject(new Error("Question not found"));
        }

        return Promise.resolve(question as Question);
    },
    persistCertification: (payload) => {
        if (!CERTIFICATION_SYNC_FUNCTION_URL) {
            return Promise.reject(
                new Error("Missing EXPO_PUBLIC_CERTIFICATION_SYNC_FUNCTION_URL")
            );
        }

        return http.post<PersistCertificationResponse>(
            CERTIFICATION_SYNC_FUNCTION_URL,
            payload
        );
    },
};
