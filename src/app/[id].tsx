import {useLocalSearchParams, useRouter} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useEffect, useMemo, useState} from "react";
import {ScrollView, StyleSheet, useWindowDimensions, View} from "react-native";
import QRCode from "react-native-qrcode-svg";
import {Button} from "@/components/Button/Button";
import {Text} from "@/components/Text/Text";
import {resetSelectedAlternativesAtom} from "@/stores/question";
import {finalizeQuizAtom, initializeQuizAtom} from "@/stores/quiz";
import {certificationByUserAtom, ensureUserAtom, userAtom} from "@/stores/user";
import {styles} from "@/styles";
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

    const record = routeId ? certifications[routeId] : undefined;

    const ensureUser = useSetAtom(ensureUserAtom);
    const finalizeQuiz = useSetAtom(finalizeQuizAtom);
    const resetSelectedAlternatives = useSetAtom(resetSelectedAlternativesAtom);
    const initializeQuiz = useSetAtom(initializeQuizAtom);

    const [isComputing, setIsComputing] = useState(false);

    const {accent, lightness, darkness, text, background} = theme();
    const {width} = useWindowDimensions();

    useEffect(() => {
        ensureUser();
    }, [ensureUser]);

    const isOwner = Boolean(routeId && routeId === user.id);

    useEffect(() => {
        let mounted = true;

        if (!isOwner || record) {
            setIsComputing(false);
            return;
        }

        setIsComputing(true);

        void finalizeQuiz().finally(() => {
            if (mounted) {
                setIsComputing(false);
            }
        });

        return () => {
            mounted = false;
        };
    }, [finalizeQuiz, isOwner, record]);

    const isCertificationValid = Boolean(
        record?.validUntil && new Date(record.validUntil) > new Date()
    );

    const qrValue = useMemo(() => {
        // QR should only contain the current URL path (no extra metadata)
        // Use encoded routeId so the value is safe for URLs
        const idPath = routeId
            ? `/${encodeURIComponent(String(routeId))}`
            : "/";
        return idPath;
    }, [routeId]);

    const qrSize = Math.min(Math.floor(width * 0.55), 220);

    return (
        <ScrollView
            style={styles.scroll}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={localStyles.scrollContent}
        >
            <View style={[localStyles.card, {backgroundColor: lightness}]}>
                <Text
                    type="title"
                    style={{color: darkness, textAlign: "center"}}
                >
                    Certification
                </Text>

                <Text type="caption" style={{color: text, textAlign: "center"}}>
                    User ID: {routeId ?? "Not provided"}
                </Text>

                {isOwner && isComputing && (
                    <Text type="caption" style={{color: text}}>
                        Calculating your score...
                    </Text>
                )}

                {!record && !isComputing && (
                    <Text type="error" style={{textAlign: "center"}}>
                        No score found for this ID.
                    </Text>
                )}

                {record && (
                    <>
                        <View
                            style={[
                                localStyles.badge,
                                {
                                    backgroundColor: record.passed
                                        ? accent
                                        : background,
                                    borderColor: accent,
                                },
                            ]}
                        >
                            <Text
                                type="label"
                                style={{
                                    color: record.passed ? background : accent,
                                }}
                            >
                                {record.passed ? "CERTIFIED" : "NOT CERTIFIED"}
                            </Text>
                        </View>

                        <View style={localStyles.summary}>
                            <Text type="subtitle" style={{color: darkness}}>
                                Name: {record.name}
                            </Text>
                            <Text type="subtitle" style={{color: darkness}}>
                                Score: {record.score} / {record.total}
                            </Text>
                            <Text type="caption" style={{color: text}}>
                                Percentage: {record.percentage}%
                            </Text>
                            <Text type="caption" style={{color: text}}>
                                Issued:{" "}
                                {new Date(record.issuedAt).toLocaleDateString()}
                            </Text>
                            <Text
                                type="caption"
                                style={{color: text, textAlign: "center"}}
                            >
                                {record.validUntil
                                    ? `Valid until: ${new Date(record.validUntil).toLocaleDateString()} (${isCertificationValid ? "active" : "expired"})`
                                    : "No certificate issued (minimum passing score is 70%)."}
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
                            title="Retake Quiz"
                            onPress={() => {
                                resetSelectedAlternatives();
                                void initializeQuiz();
                                router.replace("/");
                            }}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
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
