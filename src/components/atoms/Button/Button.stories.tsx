import {Host} from "@expo/ui";
import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {Button} from "./Button";

const meta = {
    title: "Button",
    component: Button,
    args: {
        title: "Click Me",
        onPress: action("onPress"),
    },
    decorators: [
        (Story) => (
            <Host matchContents>
                <Story />
            </Host>
        ),
    ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Outlined: Story = {
    args: {variant: "outlined", title: "Not now"},
};

export const Disabled: Story = {
    args: {disabled: true, title: "Keep practising to unlock"},
};
