import {Row, Spacer} from "@expo/ui";
import {useNavigation} from "expo-router";
import type {ReactNode} from "react";
import {IconButton} from "@/components/atoms/IconButton/IconButton";
import {Text} from "@/components/atoms/Text/Text";
import {SPACING} from "@/theme/spacing";

export type AppBarProps = {
    title?: string;
    actions?: () => ReactNode;
};

export const AppBar = ({title, actions}: AppBarProps) => {
    const navigation = useNavigation();
    const canGoBack = navigation.canGoBack();

    return (
        <Row
            alignment="center"
            spacing={SPACING[2]}
            style={{paddingVertical: SPACING[2]}}
        >
            {canGoBack && (
                <IconButton
                    name="back"
                    testID="back-button"
                    onPress={() => navigation.goBack()}
                />
            )}

            {title && (
                <Text type="subtitle" numberOfLines={2}>
                    {title}
                </Text>
            )}

            <Spacer flexible />

            {actions?.()}
        </Row>
    );
};
