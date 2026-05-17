import type {ReactNode} from "react";
import {useState} from "react";
import {LayoutAnimation, Platform, UIManager, View} from "react-native";
import {theme} from "@/theme/colors";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {TouchableWrapper} from "../TouchableWrapper/TouchableWrapper";
import {styles} from "./Accordion.styles";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type AccordionProps = {
    title: string;
    children: ReactNode;
    defaultExpanded?: boolean;
};

export const Accordion = ({
    title,
    children,
    defaultExpanded = false,
}: AccordionProps) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const {background, lightness, text} = theme();

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: background, borderColor: lightness},
            ]}
        >
            <TouchableWrapper style={styles.header} onPress={toggleExpand}>
                <Text type="subtitle">{title}</Text>
                <Icon
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={text}
                />
            </TouchableWrapper>
            {expanded && <View style={styles.content}>{children}</View>}
        </View>
    );
};
