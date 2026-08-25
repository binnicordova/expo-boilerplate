import {ScrollView, View} from "react-native";
import {Text} from "@/components/Text/Text";
import type {CodeSnippet} from "@/models/assessment";
import {theme} from "@/theme/colors";
import {styles} from "./CodeBlock.styles";

export type CodeBlockProps = {
    snippet: CodeSnippet;
};

export const CodeBlock = ({snippet}: CodeBlockProps) => {
    const {background, accent, darkness} = theme();

    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <Text type="caption" style={[styles.caption, {color: accent}]}>
                {snippet.language}
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                <Text style={[styles.source, {color: darkness}]}>
                    {snippet.source}
                </Text>
            </ScrollView>
        </View>
    );
};
