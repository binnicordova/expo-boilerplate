import Ionicons from "@react-native-vector-icons/ionicons";
import {useNavigation} from "expo-router";
import {View} from "react-native";
import {Text} from "@/components/Text/Text";
import {TouchableWrapper} from "@/components/TouchableWrapper/TouchableWrapper";
import {FONT_SIZE} from "@/theme/fonts";
import {styles} from "./AppBar.styles";

type AppBarProps = {
    title?: string;
    actions?: () => React.ReactNode;
};

export const AppBar: React.FC<AppBarProps> = ({
    title,
    actions: appBarActions,
}) => {
    const navigation = useNavigation();

    const handleBackPress = () => navigation.canGoBack() && navigation.goBack();

    return (
        <View style={styles.container}>
            {navigation.canGoBack() && (
                <TouchableWrapper onPress={handleBackPress}>
                    <Ionicons size={FONT_SIZE[3]} name="chevron-back-outline" />
                </TouchableWrapper>
            )}
            <Text type="label" numberOfLines={2} style={styles.title}>
                {title}
            </Text>
            {appBarActions?.()}
        </View>
    );
};
