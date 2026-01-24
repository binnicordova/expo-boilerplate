import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Icon} from "../Icon/Icon";
import {Switch} from "../Switch/Switch";
import {ListItem} from "./ListItem";

const meta = {
    title: "ListItem",
    component: ListItem,
    args: {
        title: "List Item",
    },
    decorators: [
        (Story) => (
            <View style={{padding: SPACING[4]}}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof ListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        title: "Basic List Item",
        subtitle: "A useful description goes here",
        onPress: action("onPress"),
    },
};

export const WithIcons: Story = {
    args: {
        title: "Profile Settings",
        left: <Icon name="account" size={24} />,
        onPress: action("onPress"),
    },
};

export const WithCustomRight: Story = {
    render: () => (
        <ListItem
            title="Notifications"
            left={<Icon name="bell" size={24} />}
            right={<Switch value={true} onValueChange={action("toggle")} />}
        />
    ),
};
