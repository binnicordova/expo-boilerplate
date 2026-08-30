import {Icon as UIIcon} from "@expo/ui";
import type {SFSymbol} from "sf-symbols-typescript";
import {FONT_SIZE} from "@/theme/fonts";
import {useTheme} from "@/theme/useTheme";
import type {IconProps} from "./Icon.types";
import type {IconName} from "./icons";

const SYMBOL: Record<IconName, SFSymbol> = {
    back: "chevron.backward",
    forward: "chevron.right",
    certificate: "rosette",
    skills: "arrow.triangle.branch",
    timer: "timer",
    streak: "flame.fill",
    review: "arrow.clockwise",
    badge: "medal.fill",
    success: "checkmark.circle.fill",
    pending: "circle",
    failure: "xmark.circle.fill",
    alert: "exclamationmark.circle.fill",
    notification: "bell.fill",
    locked: "lock.fill",
};

export const Icon = ({name, size, color, testID}: IconProps) => {
    const {text} = useTheme();

    return (
        <UIIcon
            name={SYMBOL[name]}
            size={size ?? FONT_SIZE[3]}
            color={color ?? text}
            testID={testID ?? name}
        />
    );
};

export type {IconName};
