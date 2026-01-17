import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {Text} from "../Text/Text";
import {Accordion} from "./Accordion";

const meta: Meta<typeof Accordion> = {
    title: "Components/Accordion",
    component: Accordion,
    decorators: [
        (Story) => (
            <View style={{padding: 20}}>
                <Story />
            </View>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
    args: {
        title: "Click to expand",
        children: (
            <Text>
                This is the content hidden inside the accordion. It can contain
                any component.
            </Text>
        ),
    },
};

export const Expanded: Story = {
    args: {
        title: "Expanded by default",
        defaultExpanded: true,
        children: <Text>I am already open!</Text>,
    },
};

export const Multiple: Story = {
    render: () => (
        <View>
            <Accordion title="Section 1">
                <Text>Content for section 1</Text>
            </Accordion>
            <Accordion title="Section 2">
                <Text>Content for section 2</Text>
            </Accordion>
            <Accordion title="Section 3">
                <Text>Content for section 3</Text>
            </Accordion>
        </View>
    ),
};
