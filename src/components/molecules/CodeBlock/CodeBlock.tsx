import {Column, ScrollView, Text as UIText} from "@expo/ui";
import {Text} from "@/components/atoms/Text/Text";
import type {CodeSnippet} from "@/models/assessment";
import {CODE_FONT_SIZE, CODE_LINE_HEIGHT, FONT_FAMILY} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";
import {useTheme} from "@/theme/useTheme";
import {container} from "./CodeBlock.styles";

export type CodeBlockProps = {
    snippet: CodeSnippet;
};

export const CodeBlock = ({snippet}: CodeBlockProps) => {
    const {background, accent, darkness} = useTheme();

    return (
        <Column spacing={SPACING[2]} style={container(background)}>
            <Text type="caption" color={accent}>
                {snippet.language}
            </Text>

            <ScrollView direction="horizontal" showsIndicators={false}>
                <UIText
                    textStyle={{
                        color: darkness,
                        fontFamily: FONT_FAMILY.MONOSPACE,
                        fontSize: CODE_FONT_SIZE,
                        lineHeight: CODE_LINE_HEIGHT,
                    }}
                >
                    {snippet.source}
                </UIText>
            </ScrollView>
        </Column>
    );
};
