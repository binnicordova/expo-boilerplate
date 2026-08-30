import {Host} from "@expo/ui";
import type {Meta, StoryObj} from "@storybook/react";
import {AppBar} from "./AppBar";

const meta = {
    title: "AppBar",
    component: AppBar,
    args: {
        title: "AppBar",
    },
    decorators: [
        (Story) => (
            <Host matchContents>
                <Story />
            </Host>
        ),
    ],
} satisfies Meta<typeof AppBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
