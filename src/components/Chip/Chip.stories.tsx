import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {useState} from "react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Chip} from "./Chip";

const meta = {
    title: "Chip",
    component: Chip,
    args: {
        label: "Chip",
    },
    decorators: [
        (Story) => (
            <View
                style={{
                    padding: SPACING[4],
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: SPACING[2],
                }}
            >
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        label: "Default Chip",
        onPress: action("onPress"),
    },
};

export const Selected: Story = {
    args: {
        label: "Selected Chip",
        selected: true,
        onPress: action("onPress"),
    },
};

export const WithIcon: Story = {
    args: {
        label: "Tagged",
        icon: "tag",
        onPress: action("onPress"),
    },
};

export const Deletable: Story = {
    args: {
        label: "Removable",
        onClose: action("onClose"),
    },
};

export const FilterGroup: Story = {
    render: () => {
        const [selected, setSelected] = useState("All");
        const options = ["All", "News", "Photos", "Videos"];

        return (
            <>
                {options.map((opt) => (
                    <Chip
                        key={opt}
                        label={opt}
                        selected={selected === opt}
                        onPress={() => setSelected(opt)}
                    />
                ))}
            </>
        );
    },
};
