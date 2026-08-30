import {Column, Row} from "@expo/ui";
import {Button} from "@/components/atoms/Button/Button";
import {Icon} from "@/components/atoms/Icon/Icon";
import {Text} from "@/components/atoms/Text/Text";
import {Card} from "@/components/molecules/Card/Card";
import {DAILY_SLOT_HOURS} from "@/constants/notifications";
import {FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";

export type NotificationOptInProps = {
    streak: number;
    onEnable: () => void;
    onDismiss: () => void;
};

const FULL_WIDTH = {width: "100%"} as const;

export const NotificationOptIn = ({
    streak,
    onEnable,
    onDismiss,
}: NotificationOptInProps) => {
    const {accent, darkness, text} = useTheme();

    return (
        <Card testID="notification-opt-in">
            <Row alignment="center" spacing={SPACING[2]} style={FULL_WIDTH}>
                <Icon name="notification" size={FONT_SIZE[2]} color={accent} />
                <Text type="label" color={darkness}>
                    {streak > 1
                        ? `Protect your ${streak}-day streak`
                        : "Get reminded when it matters"}
                </Text>
            </Row>

            <Text type="caption" color={text}>
                {`Reminders land ${DAILY_SLOT_HOURS.length} times a day at the moments that matter — reviews due, streak at risk, exam unlocked. Never overnight.`}
            </Text>

            <Column spacing={SPACING[2]} style={FULL_WIDTH}>
                <Button
                    testID="notifications-enable"
                    title="Turn on reminders"
                    onPress={onEnable}
                />
                <Button
                    testID="notifications-dismiss"
                    title="Not now"
                    variant="outlined"
                    onPress={onDismiss}
                />
            </Column>
        </Card>
    );
};
