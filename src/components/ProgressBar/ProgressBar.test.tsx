import {render} from "@testing-library/react-native";
import {ProgressBar} from "./ProgressBar";

describe("ProgressBar Component", () => {
    it("renders correctly with given progress", () => {
        const {getByTestId} = render(
            <ProgressBar progress={0.5} testID="progress-bar" />
        );
        const progressBar = getByTestId("progress-bar");
        expect(progressBar).toBeTruthy();
        const progressIndicator = getByTestId("progress-indicator");
        expect(progressIndicator.props.style).toContainEqual(
            expect.objectContaining({width: "50%"})
        );
    });

    it("clamps progress to 100% if value > 1", () => {
        const {getByTestId} = render(
            <ProgressBar progress={1.5} testID="progress-bar" />
        );
        const progressIndicator = getByTestId("progress-indicator");
        expect(progressIndicator.props.style).toContainEqual(
            expect.objectContaining({width: "100%"})
        );
    });
});
