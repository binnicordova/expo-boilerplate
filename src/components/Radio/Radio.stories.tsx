import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {useState} from "react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {RadioButton, RadioGroup} from "./Radio";

const meta = {
    title: "Radio",
    component: RadioGroup,
    args: {
        options: [],
        selectedValue: "",
        onValueChange: () => {},
    },
    decorators: [
        (Story) => (
            <View style={{padding: SPACING[4]}}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleButton: Story = {
    render: () => {
        const [selected, setSelected] = useState(false);
        return (
            <RadioButton
                label="Standalone Radio"
                selected={selected}
                onPress={() => setSelected(!selected)}
            />
        );
    },
};

export const Group: Story = {
    render: () => {
        const [value, setValue] = useState("option1");
        const options = [
            {label: "Option 1", value: "option1"},
            {label: "Option 2", value: "option2"},
            {label: "Option 3", value: "option3"},
        ];
        return (
            <RadioGroup
                options={options}
                selectedValue={value}
                onValueChange={(val) => {
                    setValue(val as string);
                    action("onValueChange")(val);
                }}
            />
        );
    },
};

export const Disabled: Story = {
    args: {
        options: [{label: "Cant touch this", value: "1"}],
        selectedValue: "1",
        onValueChange: action("onValueChange"),
        disabled: true,
    },
};
