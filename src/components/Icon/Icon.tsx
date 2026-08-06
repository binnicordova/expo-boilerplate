import Ionicons from "@react-native-vector-icons/ionicons";
import type {ComponentProps} from "react";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";

// const glyphMap = MaterialCommunityIconsType.glyphMap;

// const MaterialCommunityIcons = createIconSet(
//     glyphMap,
//     "fontFamily",
//     require("../../../assets/fonts/MaterialCommunityIcons.ttf")
// );

export type IconProps = ComponentProps<typeof Ionicons>;
export type IconName = IconProps["name"];

export const Icon = ({name, style, size, onPress, ...props}: IconProps) => {
    const color = theme().text;

    return (
        <Ionicons
            name={name}
            style={[style]}
            size={size ?? FONT_SIZE[3]}
            color={color}
            onPress={onPress}
            testID={name}
            {...props}
        />
    );
};
