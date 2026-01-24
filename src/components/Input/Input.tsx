import {TextInput, type TextInputProps, View} from "react-native";
import {theme} from "@/theme/colors";
import {Text} from "../Text/Text";
import {styles} from "./Input.styles";

export type InputProps = TextInputProps & {
    label?: string;
    error?: string;
};

export const Input = ({label, error, style, ...props}: InputProps) => {
    const {text, accent, error: errorColor, background} = theme();

    return (
        <View style={styles.container}>
            {label && (
                <Text type="label" style={[styles.label, {color: text}]}>
                    {label}
                </Text>
            )}
            <TextInput
                {...props}
                style={[
                    styles.input,
                    {
                        color: text,
                        borderColor: accent,
                        backgroundColor: background,
                    },
                    error ? {borderColor: errorColor} : undefined,
                    style,
                ]}
                placeholderTextColor={`${text}80`} // 50% opacity for placeholder
            />
            {error && (
                <Text
                    type="error"
                    style={[styles.errorText, {color: errorColor}]}
                >
                    {error}
                </Text>
            )}
        </View>
    );
};
