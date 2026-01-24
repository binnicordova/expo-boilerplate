import type React from "react";
import {TouchableOpacity, View} from "react-native";
import type {Article} from "@/models/article";
import {theme} from "@/theme/colors";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./NewsListItem.styles";

export type NewsListItemProps = {
    item: Article;
    onPress?: () => void;
};

export const NewsListItem: React.FC<NewsListItemProps> = ({item, onPress}) => {
    const {background} = theme();
    return (
        <TouchableOpacity
            style={[styles.card, {backgroundColor: background}]}
            activeOpacity={0.7}
            onPress={onPress}
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
        </TouchableOpacity>
    );
};
