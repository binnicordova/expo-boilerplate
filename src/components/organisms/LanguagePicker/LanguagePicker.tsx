import {Column, Row} from "@expo/ui";
import {useAtomValue, useSetAtom} from "jotai";
import {Button} from "@/components/atoms/Button/Button";
import {Text} from "@/components/atoms/Text/Text";
import {Card} from "@/components/molecules/Card/Card";
import {
    LOCALE_AUTONYM,
    LOCALES,
    type LocalePreference,
    SYSTEM_LOCALE,
} from "@/constants/locales";
import {useTranslation} from "@/i18n";
import {
    localePreferenceValueAtom,
    setLocalePreferenceAtom,
} from "@/stores/locale";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";

const FULL_WIDTH = {width: "100%"} as const;

export const LanguagePicker = () => {
    const preference = useAtomValue(localePreferenceValueAtom);
    const setPreference = useSetAtom(setLocalePreferenceAtom);
    const {darkness, text} = useTheme();
    const {t} = useTranslation();

    const options: {value: LocalePreference; label: string}[] = [
        {value: SYSTEM_LOCALE, label: t("language.system")},
        ...LOCALES.map((locale) => ({
            value: locale,
            label: LOCALE_AUTONYM[locale],
        })),
    ];

    return (
        <Card testID="language-picker">
            <Text type="label" color={darkness}>
                {t("language.title")}
            </Text>

            <Text type="caption" color={text}>
                {t("language.hint")}
            </Text>

            <Row spacing={SPACING[2]} alignment="center" style={FULL_WIDTH}>
                {options.map((option) => (
                    <Column key={option.value} style={FULL_WIDTH}>
                        <Button
                            testID={`locale-${option.value}`}
                            title={option.label}
                            variant={
                                option.value === preference
                                    ? "filled"
                                    : "outlined"
                            }
                            onPress={() => void setPreference(option.value)}
                        />
                    </Column>
                ))}
            </Row>
        </Card>
    );
};
