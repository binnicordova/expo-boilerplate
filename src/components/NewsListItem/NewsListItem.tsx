import type React from "react";
import type {StyleProp, ViewStyle} from "react-native";
import {View} from "react-native";
import {isTV} from "@/constants/platform";
import type {Article} from "@/models/article";
import {theme} from "@/theme/colors";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {TouchableWrapper} from "../TouchableWrapper/TouchableWrapper";
import {styles} from "./NewsListItem.styles";

export type NewsListItemProps = {
    item: Article;
    onPress?: () => void;
    onFocus?: () => void;
    hasTVPreferredFocus?: boolean;
    focusedStyle?: StyleProp<ViewStyle>;
};

export const NewsListItem: React.FC<NewsListItemProps> = ({
    item,
    onPress,
    onFocus,
    hasTVPreferredFocus,
    focusedStyle,
}) => {
    const {background} = theme();
    return (
        <TouchableWrapper
            style={[styles.card, {backgroundColor: background}]}
            onPress={onPress}
            onFocus={onFocus}
            hasTVPreferredFocus={isTV && hasTVPreferredFocus}
            focusedStyle={focusedStyle}
        >
            <View style={styles.row}>
                <View style={{flex: 1}}>
                    <Text type="link" numberOfLines={2} style={styles.title}>
                        {item.story_title}
                    </Text>
                    {item.comment_text && (
                        <Text
                            type="default"
                            numberOfLines={2}
                            style={styles.comment}
                        >
                            {item.comment_text.replace(/<[^>]*>/g, "")}
                        </Text>
                    )}
                    <View style={styles.metaContainer}>
                        <Text type="caption" style={styles.metaText}>
                            By <Text type="label">{item.author}</Text>
                        </Text>
                        <Text type="caption" style={styles.metaText}>
                            {item.created_at.toLocaleLowerCase()}
                        </Text>
                    </View>
                </View>
                <Icon name="chevron-right" size={30} />
            </View>
        </TouchableWrapper>
    );
};
