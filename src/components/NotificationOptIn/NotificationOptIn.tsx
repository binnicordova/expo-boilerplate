import {View} from "react-native";
import {Button} from "@/components/Button/Button";
import {Icon} from "@/components/Icon/Icon";
import {Text} from "@/components/Text/Text";
import {DAILY_SLOT_HOURS} from "@/constants/notifications";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {styles} from "./NotificationOptIn.styles";

export type NotificationOptInProps = {
    streak: number;
    onEnable: () => void;
    onDismiss: () => void;
};

export const NotificationOptIn = ({
    streak,
    onEnable,
    onDismiss,
}: NotificationOptInProps) => {
    const {accent, background, lightness, darkness, text} = theme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: lightness, borderColor: accent},
            ]}
        >
            <View style={styles.header}>
                <Icon name="notifications" size={FONT_SIZE[2]} color={accent} />
                <Text type="label" style={[styles.title, {color: darkness}]}>
                    {streak > 1
                        ? `Protect your ${streak}-day streak`
                        : "Get reminded when it matters"}
                </Text>
            </View>

            <Text type="caption" style={{color: text}}>
                Reminders land {DAILY_SLOT_HOURS.length} times a day at the
                moments that matter — reviews due, streak at risk, exam
                unlocked. Never overnight.
            </Text>

            <Button title="Turn on reminders" onPress={onEnable} />
            <Button
                title="Not now"
                onPress={onDismiss}
                style={{backgroundColor: background, borderColor: accent}}
                textColor={accent}
            />
        </View>
    );
};
