import type {Meta, StoryObj} from "@storybook/react";
import {AppBar} from "./AppBar";

const meta = {
    title: "AppBar",
    component: AppBar,
    args: {
        title: "AppBar",
    },
} satisfies Meta<typeof AppBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        title: "AppBar",
    },
};
