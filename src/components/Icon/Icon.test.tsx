import {render} from "@testing-library/react-native";
import {Icon} from "./Icon";

jest.mock("@react-native-vector-icons/ionicons", () => {
    const React = require("react");
    const {Text} = require("react-native");
    return {
        __esModule: true,
        default: (props: Record<string, unknown>) => {
            return React.createElement(
                Text,
                {
                    testID: (props.testID as string) || (props.name as string),
                    ...props,
                },
                "IconMock"
            );
        },
    };
});

describe("Icon Component", () => {
    it("renders correctly with default props", () => {
        const ICON_NAME = "home";
        const ICON_TEST_ID = "icon_home";

        const {getByTestId} = render(
            <Icon name={ICON_NAME} testID={ICON_TEST_ID} />
        );
        const icon = getByTestId(ICON_TEST_ID);
        expect(icon).toBeTruthy();
    });
});
