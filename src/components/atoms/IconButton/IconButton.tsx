import {Button as UIButton} from "@expo/ui";
import {Icon} from "@/components/atoms/Icon/Icon";
import type {IconName} from "@/components/atoms/Icon/icons";
import {ICON_SIZE} from "@/theme/typography";
import {useTheme} from "@/theme/useTheme";

export type IconButtonProps = {
    name: IconName;
    onPress: () => void;
    size?: number;
    color?: string;
    disabled?: boolean;
    testID?: string;
};

export const IconButton = ({
    name,
    onPress,
    size,
    color,
    disabled,
    testID,
}: IconButtonProps) => {
    const {accent} = useTheme();

    return (
        <UIButton
            testID={testID ?? `${name}-button`}
            variant="text"
            disabled={disabled}
            onPress={disabled ? undefined : onPress}
        >
            <Icon
                name={name}
                size={size ?? ICON_SIZE.large}
                color={color ?? accent}
            />
        </UIButton>
    );
};
