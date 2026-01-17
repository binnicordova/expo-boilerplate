import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {FAB} from "./FAB";

const meta = {
    title: "FAB",
    component: FAB,
    decorators: [
        (Story) => (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof FAB>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        icon: "plus",
        onPress: action("onPress"),
    },
};

export const CustomColor: Story = {
    args: {
        icon: "pencil",
        backgroundColor: "#4CAF50",
        color: "#FFF",
        onPress: action("onPress"),
    },
};

export const Small: Story = {
    args: {
        icon: "share-variant",
        size: 40,
        onPress: action("onPress"),
    },
};
