import {FlashList} from "@shopify/flash-list";
import {router} from "expo-router";
import {useAtomValue, useSetAtom} from "jotai";
import {useEffect} from "react";
import {RefreshControl, TouchableOpacity, View} from "react-native";
import {AppBar} from "@/components/AppBar/AppBar";
import {Button} from "@/components/Button/Button";
import {Icon} from "@/components/Icon/Icon";
import {Text} from "@/components/Text/Text";
import {PATHS} from "@/constants/routes";
import {STRINGS} from "@/constants/strings";
import type {Category} from "@/models/category";
import {
    categoriesAtom,
    categoriesErrorAtom,
    categoriesLoadingAtom,
    favoriteCategoriesAtom,
    favoritesLastUpdatedAtom,
    fetchCategoriesAtom,
    toggleFavoriteCategoryAtom,
} from "@/stores/categoriesStore";
import {styles} from "@/styles";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";

const COLUMNS = 2;

type ItemProps = {
    item: Category;
    index: number;
};

const HomeScreen = () => {
    const {text, background, accent} = theme();

    const categories = useAtomValue(categoriesAtom);
    const favoriteCategories = useAtomValue(favoriteCategoriesAtom);
    const favoritesLastUpdated = useAtomValue(favoritesLastUpdatedAtom);
    const loading = useAtomValue(categoriesLoadingAtom);
    const error = useAtomValue(categoriesErrorAtom);
    const fetchCategories = useSetAtom(fetchCategoriesAtom);
    const toggleFavoriteCategory = useSetAtom(toggleFavoriteCategoryAtom);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const skip = () =>
        router.push(
            PATHS.WEB(
                "https://www.linkedin.com/in/binnicordova",
                "Binni Cordova"
            )
        );

    const onContinue = async () => router.push(PATHS.NEWS);

    const emptyList: React.FC = () => (
        <Text type={error ? "error" : "default"} style={styles.informationText}>
            {error || (loading ? STRINGS.loading : STRINGS.empty)}
        </Text>
    );

    const header: React.FC = () => (
        <>
            <AppBar
                title=""
                actions={() => (
                    <TouchableOpacity onPress={skip}>
                        <Text type="label">
                            See author, Binni Cordova, on LinkedIn
                            <Icon
                                name="chevron-double-right"
                                size={FONT_SIZE[3]}
                            />
                        </Text>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.body}>
                <Text type="title">{STRINGS.home.title}</Text>
                <Text type="label">{STRINGS.home.subtitle}</Text>
            </View>
            <View style={styles.body}>
                <Text type="subtitle" style={styles.headList}>
                    {STRINGS.home.message}
                </Text>
            </View>
        </>
    );

    const renderItem = ({item, index}: ItemProps) => {
        const isFavorite = favoriteCategories.includes(item.name);
        const backgroundColor = isFavorite ? accent : background;
        const color = isFavorite ? background : text;
        return (
            <TouchableOpacity
                onPress={() => toggleFavoriteCategory(item)}
                style={[
                    styles.masonryCard,
                    {backgroundColor, borderColor: color},
                ]}
            >
                <Icon name={item.icon} size={FONT_SIZE[10]} color={color} />
                <Text type="label" key={index} style={{color}}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const footer: React.FC = () => (
        <View style={styles.body}>
            <Text type="caption">{STRINGS.home.conditions}</Text>
            <Button title={STRINGS.home.action} onPress={onContinue} />
        </View>
    );

    return (
        <FlashList
            masonry
            refreshing={loading}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    title={STRINGS.loading}
                    tintColor={text}
                    titleColor={text}
                    progressBackgroundColor={background}
                    onRefresh={fetchCategories}
                />
            }
            data={categories}
            renderItem={renderItem}
            extraData={favoritesLastUpdated}
            keyExtractor={(item: Category) => item.name}
            numColumns={COLUMNS}
            ListHeaderComponent={header}
            ListEmptyComponent={emptyList}
            ListFooterComponent={footer}
            contentContainerStyle={styles.safeArea}
        />
    );
};

export default HomeScreen;
