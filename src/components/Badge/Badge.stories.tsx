import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Badge} from "./Badge";

const meta = {
    title: "Badge",
    component: Badge,
    args: {
        label: "Badge",
    },
    decorators: [
        (Story) => (
            <View
                style={{
                    padding: SPACING[4],
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: SPACING[2],
                }}
            >
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
    render: () => (
        <>
            <Badge label="Default" variant="default" />
            <Badge label="Primary" variant="primary" />
            <Badge label="Success" variant="success" />
            <Badge label="Error" variant="error" />
            <Badge label="Info" variant="info" />
        </>
    ),
};

export const Counts: Story = {
    render: () => (
        <>
            <Badge label={5} variant="primary" />
            <Badge label={99} variant="error" />
            <Badge label="100+" variant="default" />
        </>
    ),
};
