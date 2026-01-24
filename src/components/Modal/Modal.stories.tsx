import type {Meta, StoryObj} from "@storybook/react";
import {useState} from "react";
import {View} from "react-native";
import {Button} from "../Button/Button";
import {Text} from "../Text/Text";
import {Modal, type ModalProps} from "./Modal";

const ModalWithState = (args: ModalProps) => {
    const [visible, setVisible] = useState(false);
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Button title="Open Modal" onPress={() => setVisible(true)} />
            <Modal
                {...args}
                visible={visible}
                onClose={() => setVisible(false)}
            />
        </View>
    );
};

const meta: Meta<typeof Modal> = {
    title: "Components/Modal",
    component: Modal,
    decorators: [
        (Story) => (
            <View style={{flex: 1, padding: 20}}>
                <Story />
            </View>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
    render: (args) => <ModalWithState {...args} />,
    args: {
        title: "Default Modal",
        children: <Text>This is a default modal content.</Text>,
    },
};

export const WithFooter: Story = {
    render: (args) => <ModalWithState {...args} />,
    args: {
        title: "Confirm Action",
        children: <Text>Are you sure you want to delete this item?</Text>,
        footer: (
            <>
                <Button title="Cancel" />
                <Button title="Delete" />
            </>
        ),
    },
};
