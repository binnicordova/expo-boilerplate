import {Column, Row} from "@expo/ui";
import {Button} from "@/components/atoms/Button/Button";
import {Icon} from "@/components/atoms/Icon/Icon";
import {Text} from "@/components/atoms/Text/Text";
import {Card} from "@/components/molecules/Card/Card";
import {DAILY_SLOT_HOURS} from "@/constants/notifications";
import {useTranslation} from "@/i18n";
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
    const {t} = useTranslation();

    return (
        <Card testID="notification-opt-in">
            <Row alignment="center" spacing={SPACING[2]} style={FULL_WIDTH}>
                <Icon name="notification" size={FONT_SIZE[2]} color={accent} />
                <Text type="label" color={darkness}>
                    {streak > 1
                        ? t("notificationOptIn.titleWithStreak", {days: streak})
                        : t("notificationOptIn.title")}
                </Text>
            </Row>

            <Text type="caption" color={text}>
                {t("notificationOptIn.body", {
                    times: DAILY_SLOT_HOURS.length,
                })}
            </Text>

            <Column spacing={SPACING[2]} style={FULL_WIDTH}>
                <Button
                    testID="notifications-enable"
                    title={t("notificationOptIn.enable")}
                    onPress={onEnable}
                />
                <Button
                    testID="notifications-dismiss"
                    title={t("notificationOptIn.dismiss")}
                    variant="outlined"
                    onPress={onDismiss}
                />
            </Column>
        </Card>
    );
};
