import type {ReactNode} from "react";
import {ScrollView, type StyleProp, View, type ViewStyle} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {theme} from "@/theme/colors";
import {SPACING} from "@/theme/spacing";
import {styles} from "./Screen.styles";

export type ScreenProps = {
    children: ReactNode;
    scroll?: boolean;
    centered?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
};

export const Screen = ({
    children,
    scroll = true,
    centered = false,
    contentContainerStyle,
}: ScreenProps) => {
    const insets = useSafeAreaInsets();
    const {background} = theme();

    const edges = {
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
    };

    const bottomInset = {paddingBottom: insets.bottom + SPACING[4]};

    if (!scroll) {
        return (
            <View
                style={[
                    styles.container,
                    {backgroundColor: background},
                    edges,
                    bottomInset,
                    centered ? styles.centered : styles.content,
                    contentContainerStyle,
                ]}
            >
                {children}
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.scroll, {backgroundColor: background}, edges]}
            contentInsetAdjustmentBehavior="never"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
                centered ? styles.centered : styles.content,
                bottomInset,
                contentContainerStyle,
            ]}
        >
            {children}
        </ScrollView>
    );
};
