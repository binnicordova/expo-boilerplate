import {Platform} from "react-native";

export const isTV = Platform.isTV;
export const isAppleTV = isTV && Platform.OS === "ios";
export const isAndroidTV = isTV && Platform.OS === "android";
