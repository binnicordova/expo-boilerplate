import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Text} from "../Text/Text";
import {Card} from "./Card";

const meta = {
    title: "Card",
    component: Card,
    args: {
        children: <Text>Card Content</Text>,
    },
    decorators: [
        (Story) => (
            <View
                style={{
                    padding: SPACING[4],
                    backgroundColor: "#f0f0f0",
                    flex: 1,
                }}
            >
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: (args) => (
        <Card {...args}>
            <Text type="title">Card Title</Text>
            <Text>This is some content inside the card.</Text>
        </Card>
    ),
};

export const WithoutShadow: Story = {
    args: {
        withShadow: false,
    },
    render: (args) => (
        <Card {...args}>
            <Text type="title">No Shadow Card</Text>
            <Text>This card doesn't have a shadow, only a border.</Text>
        </Card>
    ),
};
