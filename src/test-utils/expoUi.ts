import type {ReactTestInstance} from "react-test-renderer";

type Root = {findAll: ReactTestInstance["findAll"]};

const isHostNodeWith =
    (prop: string, predicate: (value: unknown) => boolean) =>
    (node: ReactTestInstance) =>
        typeof node.type === "string" &&
        node.props !== null &&
        typeof node.props === "object" &&
        predicate((node.props as Record<string, unknown>)[prop]);

export const queryAllByUIProp = (root: Root, prop: string, value: unknown) =>
    root.findAll(isHostNodeWith(prop, (found) => found === value));

export const queryByUIProp = (root: Root, prop: string, value: unknown) =>
    queryAllByUIProp(root, prop, value)[0];

export const getByUIProp = (root: Root, prop: string, value: unknown) => {
    const node = queryByUIProp(root, prop, value);

    if (!node) {
        throw new Error(
            `No Expo UI node found with ${prop}="${String(value)}"`
        );
    }

    return node;
};

export const queryAllByUIText = (root: Root, value: string) =>
    queryAllByUIProp(root, "text", value);

export const queryByUIText = (root: Root, value: string) =>
    queryByUIProp(root, "text", value);

export const getByUIText = (root: Root, value: string) =>
    getByUIProp(root, "text", value);

export const getByUILabel = (root: Root, value: string) =>
    getByUIProp(root, "label", value);

export const uiTexts = (root: Root) =>
    root
        .findAll(isHostNodeWith("text", (value) => typeof value === "string"))
        .map((node) => (node.props as Record<string, string>).text);
