import type {ReactNode} from "react";
import {StyleSheet, View, type ViewProps} from "react-native";
import {SPACING} from "@/theme/spacing";
import {Button} from "../Button/Button";
import {Icon, type IconName} from "../Icon/Icon";
import {Text} from "../Text/Text";

export type EmptyStateProps = ViewProps & {
    title: string;
    description?: string;
    icon?: IconName;
    actionLabel?: string;
    onAction?: () => void;
    children?: ReactNode;
};

export const EmptyState = ({
    title,
    description,
    icon = "alert-circle-outline",
    actionLabel,
    onAction,
    children,
    style,
    ...props
}: EmptyStateProps) => {
    return (
        <View style={[styles.container, style]} {...props}>
            <Icon name={icon} size={64} style={styles.icon} />
            <Text type="title" style={styles.title}>
                {title}
            </Text>
            {description && (
                <Text style={styles.description}>{description}</Text>
            )}
            {children}
            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    onPress={onAction}
                    style={styles.button}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING[6],
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        marginBottom: SPACING[4],
        opacity: 0.5,
    },
    title: {
        textAlign: "center",
        marginBottom: SPACING[2],
    },
    description: {
        textAlign: "center",
        opacity: 0.7,
        marginBottom: SPACING[6],
    },
    button: {
        minWidth: 150,
    },
});
