import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Skeleton} from "./Skeleton";

const meta = {
    title: "Skeleton",
    component: Skeleton,
    decorators: [
        (Story) => (
            <View style={{padding: SPACING[4], gap: SPACING[2]}}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        width: "100%",
        height: 20,
    },
};

export const Circle: Story = {
    args: {
        width: 60,
        height: 60,
        variant: "circle",
    },
};

export const Rounded: Story = {
    args: {
        width: "100%",
        height: 100,
        variant: "rounded",
    },
};

export const ContentLoadingExample: Story = {
    render: () => (
        <View
            style={{
                flexDirection: "row",
                gap: SPACING[3],
                alignItems: "center",
            }}
        >
            <Skeleton variant="circle" width={50} height={50} />
            <View style={{flex: 1, gap: SPACING[2]}}>
                <Skeleton width="60%" height={15} variant="rounded" />
                <Skeleton width="100%" height={12} variant="rounded" />
            </View>
        </View>
    ),
};
