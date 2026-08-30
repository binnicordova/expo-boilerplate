import {Column, Row, Spacer, Button as UIButton} from "@expo/ui";
import {Icon} from "@/components/atoms/Icon/Icon";
import {Text} from "@/components/atoms/Text/Text";
import type {Article} from "@/models/article";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";
import {surfaceModifiers, surfaceStyle} from "@/theme/surface";
import {useTheme} from "@/theme/useTheme";
import {stripHtml} from "@/utils/html";
import {card} from "./NewsListItem.styles";

export type NewsListItemProps = {
    item: Article;
    onPress?: () => void;
    testID?: string;
};

export const NewsListItem = ({
    item,
    onPress,
    testID = "news-list-item",
}: NewsListItemProps) => {
    const {accent, background, text} = useTheme();

    return (
        <UIButton
            testID={testID}
            variant="text"
            onPress={onPress}
            style={surfaceStyle({
                fill: true,
                paddingHorizontal: 0,
                paddingVertical: 0,
            })}
        >
            <Row
                alignment="center"
                spacing={SPACING[3]}
                modifiers={surfaceModifiers({
                    fill: true,
                    interactive: true,
                    padding: SPACING[4],
                    radius: RADIUS[5] * 1.5,
                    backgroundColor: background,
                })}
                style={card(background)}
            >
                <Column spacing={SPACING[1]}>
                    <Text type="link" color={accent} numberOfLines={2}>
                        {item.story_title}
                    </Text>

                    {item.comment_text && (
                        <Text type="default" numberOfLines={2}>
                            {stripHtml(item.comment_text)}
                        </Text>
                    )}

                    <Row alignment="center" spacing={SPACING[2]}>
                        <Text type="caption" color={text}>
                            {`By ${item.author}`}
                        </Text>
                        <Spacer flexible />
                        <Text type="caption" color={text}>
                            {item.created_at.toLocaleLowerCase()}
                        </Text>
                    </Row>
                </Column>

                <Spacer flexible />

                <Icon name="forward" size={SPACING[7]} />
            </Row>
        </UIButton>
    );
};
