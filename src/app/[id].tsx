import {useLocalSearchParams, useRouter} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useEffect, useMemo} from "react";
import {StyleSheet, useWindowDimensions, View} from "react-native";
import QRCode from "react-native-qrcode-svg";
import {Button} from "@/components/Button/Button";
import {Screen} from "@/components/Screen/Screen";
import {Text} from "@/components/Text/Text";
import {PASS_OVERALL} from "@/constants/certification";
import {PATHS} from "@/constants/routes";
import {certificationByUserAtom, ensureUserAtom, userAtom} from "@/stores/user";
import {theme} from "@/theme/colors";

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

    const {accent, lightness, darkness, text, background} = theme();
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
            <View style={[localStyles.card, {backgroundColor: lightness}]}>
                <Text
                    type="title"
                    style={{color: darkness, textAlign: "center"}}
                >
                    Certification
                </Text>

                <Text type="caption" style={{color: text, textAlign: "center"}}>
                    ID: {routeId ?? "Not provided"}
                </Text>

                {!record && (
                    <>
                        <Text type="error" style={{textAlign: "center"}}>
                            No certification issued for this ID.
                        </Text>
                        <Text
                            type="caption"
                            style={{color: text, textAlign: "center"}}
                        >
                            The credential is earned by passing the
                            certification exam at{" "}
                            {Math.round(PASS_OVERALL * 100)}% or above.
                        </Text>
                    </>
                )}

                {record && (
                    <>
                        <View
                            style={[
                                localStyles.badge,
                                {
                                    backgroundColor: isValid
                                        ? accent
                                        : background,
                                    borderColor: accent,
                                },
                            ]}
                        >
                            <Text
                                type="label"
                                style={{color: isValid ? background : accent}}
                            >
                                {isValid ? "CERTIFIED" : "EXPIRED"}
                            </Text>
                        </View>

                        <View style={localStyles.summary}>
                            <Text type="subtitle" style={{color: darkness}}>
                                {record.name}
                            </Text>
                            <Text type="subtitle" style={{color: darkness}}>
                                {record.score} / {record.total} ·{" "}
                                {record.percentage}%
                            </Text>
                            <Text type="caption" style={{color: text}}>
                                Expert section:{" "}
                                {Math.round(record.expertScore * 100)}%
                            </Text>
                            <Text type="caption" style={{color: text}}>
                                Issued{" "}
                                {new Date(record.issuedAt).toLocaleDateString()}
                            </Text>
                            <Text
                                type="caption"
                                style={{color: text, textAlign: "center"}}
                            >
                                Valid until{" "}
                                {new Date(
                                    record.validUntil
                                ).toLocaleDateString()}
                            </Text>
                        </View>

                        <View style={localStyles.qrContainer}>
                            <QRCode value={qrValue} size={qrSize} />
                        </View>
                    </>
                )}

                {isOwner && (
                    <View style={localStyles.actions}>
                        <Button
                            title={record ? "Back to practice" : "Practice now"}
                            onPress={() => router.replace(PATHS.HOME)}
                        />
                    </View>
                )}
            </View>
        </Screen>
    );
};

const localStyles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "100%",
        maxWidth: 760,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        gap: 14,
    },
    badge: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    summary: {
        width: "100%",
        alignItems: "center",
        gap: 4,
    },
    qrContainer: {
        marginTop: 8,
        padding: 10,
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    actions: {
        width: "100%",
        marginTop: 8,
    },
});

export default ResultByIdScreen;
