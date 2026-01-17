import {render} from "@testing-library/react-native";
import {StyleSheet} from "react-native";
import {Skeleton} from "./Skeleton";

describe("Skeleton Component", () => {
    it("renders correctly", () => {
        const {getByTestId} = render(<Skeleton />);
        expect(getByTestId("skeleton")).toBeTruthy();
    });

    it("applies variant styles", () => {
        const {getByTestId} = render(<Skeleton variant="circle" height={50} />);
        const skeleton = getByTestId("skeleton");
        expect(StyleSheet.flatten(skeleton.props.style)).toMatchObject({
            borderRadius: 25,
        });
    });

    it("applies custom size", () => {
        const {getByTestId} = render(<Skeleton width={100} height={40} />);
        const skeleton = getByTestId("skeleton");
        expect(StyleSheet.flatten(skeleton.props.style)).toMatchObject({
            width: 100,
            height: 40,
        });
    });
});
