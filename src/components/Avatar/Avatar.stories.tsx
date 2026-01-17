import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Avatar} from "./Avatar";

const meta = {
    title: "Avatar",
    component: Avatar,
    decorators: [
        (Story) => (
            <View
                style={{
                    padding: SPACING[4],
                    flexDirection: "row",
                    gap: SPACING[2],
                }}
            >
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initials: Story = {
    args: {
        name: "Binni Cordova",
    },
};

export const Image: Story = {
    args: {
        uri: "https://i.pravatar.cc/150?u=binni",
        size: 60,
    },
};

export const Rounded: Story = {
    args: {
        name: "Expo User",
        variant: "rounded",
        size: 50,
    },
};

export const Sizes: Story = {
    render: () => (
        <>
            <Avatar name="Small" size={24} />
            <Avatar name="Medium" size={48} />
            <Avatar name="Large" size={80} />
        </>
    ),
};
