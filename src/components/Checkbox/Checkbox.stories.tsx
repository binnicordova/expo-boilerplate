import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {useState} from "react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Checkbox} from "./Checkbox";

const meta = {
    title: "Checkbox",
    component: Checkbox,
    args: {
        checked: false,
        onChange: () => {},
    },
    decorators: [
        (Story) => (
            <View style={{padding: SPACING[4]}}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: (args) => {
        const [checked, setChecked] = useState(false);
        return (
            <Checkbox
                {...args}
                checked={checked}
                onChange={(val) => {
                    setChecked(val);
                    action("onChange")(val);
                }}
                label="Basic Checkbox"
            />
        );
    },
};

export const Disabled: Story = {
    args: {
        checked: true,
        disabled: true,
        label: "Disabled Checkbox",
    },
};
