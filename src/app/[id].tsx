import {Column, RNHostView} from "@expo/ui";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useEffect, useMemo} from "react";
import {useWindowDimensions} from "react-native";
import QRCode from "react-native-qrcode-svg";
import {Button} from "@/components/atoms/Button/Button";
import {Text} from "@/components/atoms/Text/Text";
import {Card} from "@/components/molecules/Card/Card";
import {Screen} from "@/components/templates/Screen/Screen";
import {PASS_OVERALL} from "@/constants/certification";
import {PATHS} from "@/constants/routes";
import {useTranslation} from "@/i18n";
import {certificationByUserAtom, ensureUserAtom, userAtom} from "@/stores/user";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";
import {pill} from "@/theme/ui";
import {useTheme} from "@/theme/useTheme";
import {formatDate} from "@/utils/date";

const QR_SURFACE = "#FFFFFF";
const FULL_WIDTH = {width: "100%"} as const;

const ResultByIdScreen = () => {
    const params = useLocalSearchParams<{id?: string | string[]}>();
    const rawRouteId = Array.isArray(params.id) ? params.id[0] : params.id;
    const routeId = useMemo(() => {
        if (!rawRouteId) {
            return undefined;
        }

        try {
            return decodeURIComponent(String(rawRouteId));
        } catch (_error) {
            return String(rawRouteId);
        }
    }, [rawRouteId]);

    const router = useRouter();
    const user = useAtomValue(userAtom);
    const certifications = useAtomValue(certificationByUserAtom);
    const ensureUser = useSetAtom(ensureUserAtom);

    const record = routeId ? certifications[routeId] : undefined;

    const {accent, background, darkness, text} = useTheme();
    const {t, locale} = useTranslation();
    const {width} = useWindowDimensions();

    useEffect(() => {
        ensureUser();
    }, [ensureUser]);

    const isOwner = Boolean(routeId && routeId === user.id);

    const isValid = Boolean(
        record?.validUntil && new Date(record.validUntil) > new Date()
    );

    const qrValue = routeId ? `/${encodeURIComponent(String(routeId))}` : "/";
    const qrSize = Math.min(Math.floor(width * 0.55), 220);

    return (
        <Screen centered>
            <Card alignment="center" testID="certificate-card">
                <Text type="title" color={darkness} align="center">
                    {t("certificate.title")}
                </Text>

                <Text type="caption" color={text} align="center">
                    {t("certificate.id", {
                        id: routeId ?? t("certificate.idMissing"),
                    })}
                </Text>

                {!record && (
                    <Column
                        alignment="center"
                        spacing={SPACING[2]}
                        style={FULL_WIDTH}
                    >
                        <Text type="error" align="center">
                            {t("certificate.missing")}
                        </Text>
                        <Text type="caption" color={text} align="center">
                            {t("certificate.missingHint", {
                                passMark: Math.round(PASS_OVERALL * 100),
                            })}
                        </Text>
                    </Column>
                )}

                {record && (
                    <Column
                        alignment="center"
                        spacing={SPACING[3]}
                        style={FULL_WIDTH}
                    >
                        <Column
                            alignment="center"
                            style={pill(accent, isValid ? accent : background)}
                        >
                            <Text
                                type="label"
                                color={isValid ? background : accent}
                            >
                                {isValid
                                    ? t("certificate.valid")
                                    : t("certificate.expired")}
                            </Text>
                        </Column>

                        <Text type="subtitle" color={darkness} align="center">
                            {record.name}
                        </Text>
                        <Text type="subtitle" color={darkness} align="center">
                            {t("certificate.score", {
                                score: record.score,
                                total: record.total,
                                percentage: record.percentage,
                            })}
                        </Text>
                        <Text type="caption" color={text} align="center">
                            {t("certificate.expert", {
                                percentage: Math.round(
                                    record.expertScore * 100
                                ),
                            })}
                        </Text>
                        <Text type="caption" color={text} align="center">
                            {t("certificate.issued", {
                                date: formatDate(record.issuedAt, locale),
                            })}
                        </Text>
                        <Text type="caption" color={text} align="center">
                            {t("certificate.validUntil", {
                                date: formatDate(record.validUntil, locale),
                            })}
                        </Text>

                        <Column
                            alignment="center"
                            style={{
                                backgroundColor: QR_SURFACE,
                                borderRadius: RADIUS[5],
                                padding: SPACING[3],
                            }}
                        >
                            <RNHostView matchContents>
                                <QRCode value={qrValue} size={qrSize} />
                            </RNHostView>
                        </Column>
                    </Column>
                )}

                {isOwner && (
                    <Button
                        testID="certificate-action"
                        title={
                            record
                                ? t("certificate.backToPractice")
                                : t("certificate.practiceNow")
                        }
                        onPress={() => router.replace(PATHS.HOME)}
                    />
                )}
            </Card>
        </Screen>
    );
};

export default ResultByIdScreen;
