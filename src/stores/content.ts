import {atom} from "jotai";
import type {Content} from "@/models/content";
import {api} from "@/services/api";

export const contentAtom = atom<Content | null>(null);

export const fetchContentAtom = atom(
    null,
    async (_get, set, contentId?: string) => {
        const content = await api.getContent(contentId);
        set(contentAtom, content);
    }
);
