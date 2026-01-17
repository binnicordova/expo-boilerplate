# Component Standards

To maintain consistency, all UI components must follow these rules.

## File Structure
A component folder must contain:

1.  **`Component.tsx`**: Functional component with props definition.
2.  **`Component.styles.ts`**: `StyleSheet` definitions.
3.  **`Component.test.tsx`**: Unit tests using `@testing-library/react-native`.
4.  **`Component.stories.tsx`**: Storybook variants.

## Styling & Theme

- **No Inline Styles**: Move all styles to the `.styles.ts` file.
- **Theme Injection**: Import `theme` from `@/theme/colors` to use color tokens.
  
```tsx
import { theme } from '@/theme/colors';
import { styles } from './MyComponent.styles';

export const MyComponent = () => {
    const { background, text } = theme();
    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <Text style={{ color: text }}>Hello</Text>
        </View>
    );
};
```

## Testing Requirements

- **Co-location**: Tests must reside in the same folder as the implementation.
- **Coverage**: Components with interaction (onPress, inputs) or conditional rendering MUST have tests.
- **RNTL**: Use `screen` and `fireEvent` from `@testing-library/react-native`.

## Visual Documentation (Storybook)

- Every UI component should have at least one story.
- Use stories to demonstrate different states (Loading, Disabled, Error, Long Text).
- Stories are located in `src/components/MyComponent/MyComponent.stories.tsx`.

## Library Usage

- **FlashList**: Use `@shopify/flash-list` instead of `FlatList` for high-performance lists.
- **Expo Image**: Use `expo-image` for all non-vector images.
- **SF Symbols**: Prefer `expo-symbols` for iOS-native icons.
