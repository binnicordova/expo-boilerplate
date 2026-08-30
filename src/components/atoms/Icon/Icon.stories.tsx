import {Host} from "@expo/ui";
import type {Meta, StoryObj} from "@storybook/react";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {Icon} from "./Icon";

const meta = {
    title: "Icon",
    component: Icon,
    args: {
        name: "streak",
        size: FONT_SIZE[3],
        color: theme().text,
    },
    decorators: [
        (Story) => (
            <Host matchContents>
                <Story />
            </Host>
        ),
    ],
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Certificate: Story = {
    args: {name: "certificate", color: theme().accent},
};
