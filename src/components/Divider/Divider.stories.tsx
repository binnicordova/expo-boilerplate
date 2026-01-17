import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Text} from "../Text/Text";
import {Divider} from "./Divider";

const meta = {
    title: "Divider",
    component: Divider,
    decorators: [
        (Story) => (
            <View style={{padding: SPACING[4], width: "100%"}}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: () => (
        <View>
            <Text>Item Above</Text>
            <Divider />
            <Text>Item Below</Text>
        </View>
    ),
};

export const Inset: Story = {
    render: () => (
        <View>
            <Text>List Item 1</Text>
            <Divider inset />
            <Text>List Item 2</Text>
        </View>
    ),
};
