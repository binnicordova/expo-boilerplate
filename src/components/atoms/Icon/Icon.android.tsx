import {Icon as UIIcon} from "@expo/ui";
import type {ImageSourcePropType} from "react-native";
import {FONT_SIZE} from "@/theme/fonts";
import {useTheme} from "@/theme/useTheme";
import type {IconProps} from "./Icon.types";
import type {IconName} from "./icons";

const SYMBOL: Record<IconName, ImageSourcePropType> = {
    back: require("@expo/material-symbols/arrow_back.xml"),
    forward: require("@expo/material-symbols/chevron_right.xml"),
    certificate: require("@expo/material-symbols/workspace_premium.xml"),
    skills: require("@expo/material-symbols/account_tree.xml"),
    timer: require("@expo/material-symbols/timer.xml"),
    streak: require("@expo/material-symbols/local_fire_department.xml"),
    review: require("@expo/material-symbols/refresh.xml"),
    badge: require("@expo/material-symbols/military_tech.xml"),
    success: require("@expo/material-symbols/check_circle.xml"),
    pending: require("@expo/material-symbols/circle.xml"),
    failure: require("@expo/material-symbols/cancel.xml"),
    alert: require("@expo/material-symbols/error.xml"),
    notification: require("@expo/material-symbols/notifications.xml"),
    locked: require("@expo/material-symbols/lock.xml"),
};

export const Icon = ({name, size, color, testID}: IconProps) => {
    const {text} = useTheme();

    return (
        <UIIcon
            name={SYMBOL[name]}
            size={size ?? FONT_SIZE[3]}
            color={color ?? text}
            accessibilityLabel={name}
            testID={testID ?? name}
        />
    );
};

export type {IconName};
