import Ionicons from "@react-native-vector-icons/ionicons";
import type {ComponentProps} from "react";
import {FONT_SIZE} from "@/theme/fonts";
import {useTheme} from "@/theme/useTheme";
import type {IconProps} from "./Icon.types";
import type {IconName} from "./icons";

type IonIconName = ComponentProps<typeof Ionicons>["name"];

const SYMBOL: Record<IconName, IonIconName> = {
    back: "chevron-back-outline",
    forward: "chevron-forward-outline",
    certificate: "ribbon-outline",
    skills: "git-branch-outline",
    timer: "timer-outline",
    streak: "flame",
    review: "refresh",
    badge: "ribbon",
    success: "checkmark-circle",
    pending: "ellipse-outline",
    failure: "close-circle",
    alert: "alert-circle",
    notification: "notifications",
    locked: "lock-closed",
};

export const Icon = ({name, size, color, testID}: IconProps) => {
    const {text} = useTheme();

    return (
        <Ionicons
            name={SYMBOL[name]}
            size={size ?? FONT_SIZE[3]}
            color={color ?? text}
            testID={testID ?? name}
        />
    );
};

export type {IconName};
