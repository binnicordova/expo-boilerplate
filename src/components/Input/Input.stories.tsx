import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {Input} from "./Input";

const meta = {
    title: "Input",
    component: Input,
    args: {
        placeholder: "Type something...",
    },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        onChangeText: action("onChangeText"),
    },
};

export const WithLabel: Story = {
    args: {
        label: "Username",
        onChangeText: action("onChangeText"),
    },
};

export const WithError: Story = {
    args: {
        label: "Email",
        error: "Invalid email address",
        value: "invalid-email",
        onChangeText: action("onChangeText"),
    },
};
