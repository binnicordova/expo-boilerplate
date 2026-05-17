import {StyleSheet} from "react-native";
import {initialWindowMetrics} from "react-native-safe-area-context";
import {isTV} from "@/constants/platform";
import {BORDER, RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

const insets = initialWindowMetrics?.insets ?? {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
};

export const styles = StyleSheet.create({
    safeArea: {
        paddingTop: isTV ? 0 : insets.top,
        paddingBottom: isTV ? 0 : insets.bottom,
    },
    baseLayer: {
        flex: 1,
    },
    centerLayer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: SPACING[3],
    },
    body: {
        paddingHorizontal: SPACING[3],
    },
    headList: {
        paddingTop: SPACING[3],
    },
    informationText: {
        textAlign: "center",
        marginTop: SPACING[5],
    },
    masonryCard: {
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[2],
        marginHorizontal: SPACING[3],
        marginVertical: SPACING[2],
        justifyContent: "flex-end",
        alignItems: "center",
        borderRadius: RADIUS[5],
        borderWidth: BORDER[1],
        overflow: "hidden",
    },
    tvFocusedCard: {
        borderWidth: BORDER[1],
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 2},
        elevation: 3,
    },
    listItem: {
        paddingHorizontal: SPACING[3],
    },
    metaContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING[2],
    },
});
