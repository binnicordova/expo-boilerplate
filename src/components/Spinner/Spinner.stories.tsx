import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Spinner} from "./Spinner";

const meta = {
    title: "Spinner",
    component: Spinner,
    decorators: [
        (Story) => (
            <View
                style={{
                    padding: SPACING[4],
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                }}
            >
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        size: "small",
    },
};

export const Large: Story = {
    args: {
        size: "large",
    },
};

export const CustomColor: Story = {
    args: {
        color: "#FF5722",
        size: "large",
    },
};
