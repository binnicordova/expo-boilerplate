import {NavigationContainer} from "@react-navigation/native";
import type {Preview} from "@storybook/react";
import {View} from "react-native";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },

    tags: ["autodocs"],

    decorators: [
        (Story) => (
            <NavigationContainer>
                <View style={{padding: 16, flex: 1}}>
                    <Story />
                </View>
            </NavigationContainer>
        ),
    ],
};

export default preview;
