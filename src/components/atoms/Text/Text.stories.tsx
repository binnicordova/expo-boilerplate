import {Host} from "@expo/ui";
import type {Meta, StoryObj} from "@storybook/react";
import {Text} from "./Text";

const meta = {
    title: "Text",
    component: Text,
    args: {
        children: "Hello World",
        type: "default",
    },
    decorators: [
        (Story) => (
            <Host matchContents>
                <Story />
            </Host>
        ),
    ],
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Title: Story = {
    args: {type: "title", children: "Certification"},
};

export const Caption: Story = {
    args: {type: "caption", children: "12 of 25 answered"},
};
