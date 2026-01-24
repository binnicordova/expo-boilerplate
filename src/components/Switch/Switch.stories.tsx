import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {useState} from "react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Switch} from "./Switch";

const meta = {
    title: "Switch",
    component: Switch,
    decorators: [
        (Story) => (
            <View style={{padding: SPACING[4]}}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: (args) => {
        const [value, setValue] = useState(false);
        return (
            <Switch
                {...args}
                value={value}
                onValueChange={(val) => {
                    setValue(val);
                    action("onValueChange")(val);
                }}
                label="Allow Notifications"
            />
        );
    },
};

export const Disabled: Story = {
    args: {
        label: "Disabled Toggle",
        value: true,
        disabled: true,
    },
};
