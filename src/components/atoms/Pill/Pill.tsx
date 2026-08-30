import {Icon} from "@/components/atoms/Icon/Icon";
import type {IconName} from "@/components/atoms/Icon/icons";
import {Surface} from "@/components/atoms/Surface/Surface";
import {Text} from "@/components/atoms/Text/Text";
import {SPACING} from "@/theme/spacing";
import {ICON_SIZE} from "@/theme/typography";
import {useTheme} from "@/theme/useTheme";

export type PillProps = {
    label: string;
    icon?: IconName;
    tone?: string;
    backgroundColor?: string;
    testID?: string;
};

export const Pill = ({
    label,
    icon,
    tone,
    backgroundColor,
    testID,
}: PillProps) => {
    const {accent, darkness, lightness} = useTheme();
    const color = tone ?? accent;

    return (
        <Surface
            testID={testID}
            direction="row"
            alignment="center"
            spacing={SPACING[1]}
            paddingHorizontal={SPACING[3]}
            paddingVertical={SPACING[1]}
            radius="capsule"
            backgroundColor={backgroundColor ?? lightness}
        >
            {icon && <Icon name={icon} size={ICON_SIZE.small} color={color} />}
            <Text type="caption" color={darkness}>
                {label}
            </Text>
        </Surface>
    );
};
