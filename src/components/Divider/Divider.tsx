import {View, type ViewProps} from "react-native";
import {theme} from "@/theme/colors";
import {styles} from "./Divider.styles";

export type DividerProps = ViewProps & {
    color?: string;
    inset?: boolean;
    spacing?: boolean;
};

export const Divider = ({
    color,
    inset,
    spacing = true,
    style,
    ...props
}: DividerProps) => {
    const {lightness} = theme();

    return (
        <View
            style={[
                styles.divider,
                {backgroundColor: color ?? lightness},
                spacing && styles.marginVertical,
                inset && {marginLeft: 16},
                style,
            ]}
            {...props}
        />
    );
};
