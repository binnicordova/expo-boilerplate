import type {ReactNode} from "react";
import {Modal as RNModal, View} from "react-native";
import {theme} from "@/theme/colors";
import {Text} from "../Text/Text";
import {TouchableWrapper} from "../TouchableWrapper/TouchableWrapper";
import {styles} from "./Modal.styles";

export type ModalProps = {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
};

export const Modal = ({
    visible,
    onClose,
    title,
    children,
    footer,
}: ModalProps) => {
    const {background} = theme();

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWrapper
                testID="modal-overlay"
                style={styles.overlay}
                onPress={onClose}
            >
                <View style={[styles.content, {backgroundColor: background}]}>
                    <TouchableWrapper onPress={() => {}}>
                        {title && (
                            <View style={styles.header}>
                                <Text type="title" style={styles.title}>
                                    {title}
                                </Text>
                            </View>
                        )}
                        <View style={styles.body}>{children}</View>
                        {footer && <View style={styles.footer}>{footer}</View>}
                    </TouchableWrapper>
                </View>
            </TouchableWrapper>
        </RNModal>
    );
};
