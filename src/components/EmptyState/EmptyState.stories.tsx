import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {EmptyState} from "./EmptyState";

const meta = {
    title: "EmptyState",
    component: EmptyState,
    decorators: [
        (Story) => (
            <View style={{flex: 1, justifyContent: "center"}}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "No data available",
        description:
            "Your collection is currently empty. Start by adding a new item.",
        icon: "cloud-off-outline",
    },
};

export const WithAction: Story = {
    args: {
        title: "Connection Lost",
        description: "Please check your internet connection and try again.",
        icon: "wifi-off",
        actionLabel: "Try Again",
        onAction: action("onAction"),
    },
};

export const Simple: Story = {
    args: {
        title: "No results found",
        icon: "magnify",
    },
};
