import type {ReactTestInstance} from "react-test-renderer";
import {getByUIProp, queryByUIProp, uiTexts} from "./expoUi";

const node = (type: unknown, props: unknown) =>
    ({type, props}) as unknown as ReactTestInstance;

const root = {
    findAll: (predicate: (instance: ReactTestInstance) => boolean) =>
        [
            node("HostText", {text: "hello"}),
            node(function Composite() {}, {text: "hello"}),
            node("HostText", {text: "world"}),
            node("HostView", {props: null}),
        ].filter(predicate),
};

describe("expoUi test helpers", () => {
    it("matches host nodes only, ignoring composite wrappers", () => {
        expect(uiTexts(root)).toEqual(["hello", "world"]);
    });

    it("finds a host node by prop value", () => {
        expect(queryByUIProp(root, "text", "world")).toBeTruthy();
    });

    it("returns undefined when nothing matches", () => {
        expect(queryByUIProp(root, "text", "nope")).toBeUndefined();
    });

    it("throws a helpful error when a required node is missing", () => {
        expect(() => getByUIProp(root, "text", "nope")).toThrow(
            'No Expo UI node found with text="nope"'
        );
    });
});
