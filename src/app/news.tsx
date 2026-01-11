import {FlashList} from "@shopify/flash-list";
import {router} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useEffect} from "react";
import {RefreshControl} from "react-native";
import {NewsListItem} from "@/components/NewsListItem/NewsListItem";
import {Text} from "@/components/Text/Text";
import {PATHS} from "@/constants/routes";
import {STRINGS} from "@/constants/strings";
import type {Article} from "@/models/article";
import {
    articlesAtom,
    articlesErrorAtom,
    articlesLoadingAtom,
    fetchArticlesAtom,
} from "@/stores/articlesStore";
import {styles} from "@/styles";
import {theme} from "@/theme/colors";

export default function NewsScreen() {
    const {text, background} = theme();

    const articles = useAtomValue(articlesAtom);
    const loading = useAtomValue(articlesLoadingAtom);
    const error = useAtomValue(articlesErrorAtom);
    const fetchArticles = useSetAtom(fetchArticlesAtom);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const renderItem = ({item}: {item: Article}) => (
        <NewsListItem
            item={item}
            onPress={() =>
                router.push(PATHS.WEB(item.story_url, item.story_title))
            }
        />
    );

    const emptyList: React.FC = () => (
        <Text type={error ? "error" : "default"} style={styles.informationText}>
            {error || (loading ? STRINGS.loading : STRINGS.empty)}
        </Text>
    );

    return (
        <FlashList
            refreshing={loading}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    title={STRINGS.loading}
                    tintColor={text}
                    titleColor={text}
                    progressBackgroundColor={background}
                    onRefresh={fetchArticles}
                />
            }
            data={articles}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.objectID}
            contentContainerStyle={styles.safeArea}
            ListEmptyComponent={emptyList}
            style={styles.body}
        />
    );
}
