import type {Meta, StoryObj} from "@storybook/react";
import {useEffect, useState} from "react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Text} from "../Text/Text";
import {ProgressBar} from "./ProgressBar";

const meta = {
    title: "ProgressBar",
    component: ProgressBar,
    args: {
        progress: 0,
    },
    decorators: [
        (Story) => (
            <View style={{padding: SPACING[4]}}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        progress: 0.7,
    },
};

export const Animated: Story = {
    render: () => {
        const [prog, setProg] = useState(0);

        useEffect(() => {
            const interval = setInterval(() => {
                setProg((p) => (p >= 1 ? 0 : p + 0.1));
            }, 500);
            return () => clearInterval(interval);
        }, []);

        return (
            <View>
                <Text>Loading: {Math.round(prog * 100)}%</Text>
                <ProgressBar progress={prog} />
            </View>
        );
    },
};

export const CustomColor: Story = {
    args: {
        progress: 0.4,
        color: "#4CAF50",
    },
};
