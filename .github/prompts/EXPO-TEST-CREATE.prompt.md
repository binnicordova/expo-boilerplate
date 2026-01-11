# Prompt for Unit Test Generation in React Native / Expo Projects

This prompt is designed to create or update unit tests and ensure high code coverage in React Native / Expo projects using TypeScript, Jest, and React Native Testing Library.

## ⚠️ IMPORTANT: Comprehensive Testing

**It is NOT sufficient to just "render" the component.** Validating user interactions, state changes, hooks integration, and conditional rendering is mandatory.

### Mandatory Process BEFORE creating tests:

#### 1. Structure Analysis
```bash
# List all source files in the target directory
find src/target-path -type f -name "*.{ts,tsx}" | grep -v node_modules | grep -v coverage | grep -v ".test." | grep -v ".stories."
```

#### 2. Create TEST-COVERAGE-ANALYSIS.md
Create a Markdown file (can be temporary or saved in the folder) with:

**Required Content:**
```markdown
# Test Coverage Analysis - [Module Name]

## 📊 Logic Files Status
| File | Status | Tests | Justification |
|------|--------|-------|---------------|
| AppBar.tsx | ✅ Tested | 5 tests | Main UI component |
| AppBar.styles.ts | ⏭️ Skipped | - | Styles only |
| AppBar.stories.tsx | ⏭️ Skipped | - | Storybook |

## 🎯 Action Plan
[Prioritized list of files to test]
```

### What to Test:

1.  **Components**: Prop rendering, User Events (`press`, `changeText`, `scroll`), Conditional Rendering, Styles (if dynamic).
2.  **Hooks**: State initialization, State updates (using `act`), Side effects (`useEffect`).
3.  **Utils**: Input/Output validation, Edge cases.
4.  **Stores**: State mutations, Actions.

## Required Parameters
-   **target_path**: Path of the component or module to test.
-   **tools**: `Jest`, `@testing-library/react-native`, `Biome` (for formatting).

## Recommended Structure

### 1. Co-location
Tests should be placed next to the file:
`src/components/AppBar/AppBar.tsx` -> `src/components/AppBar/AppBar.test.tsx`

### 2. Test Pattern (AAA)
-   **Arrange**: Setup props, mocks, and initial state.
-   **Act**: Render component, fire events, render hook.
-   **Assert**: Check `screen.getBy...`, `expect(...)`, calls to mocks.

### Example: Component Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NewsListItem } from './NewsListItem';

describe('NewsListItem', () => {
    const mockArticle = { id: '1', title: 'News', date: '2023-01-01', category: 'Tech' };

    it('renders article details correctly', () => {
        render(<NewsListItem article={mockArticle} />);
        
        expect(screen.getByText('News')).toBeTruthy();
        expect(screen.getByText('2023-01-01')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        render(<NewsListItem article={mockArticle} onPress={onPress} />);
        
        fireEvent.press(screen.getByRole('button'));
        
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
```

### Example: Hook Test

```tsx
import { renderHook, act } from '@testing-library/react-native';
import { useNotification } from './useNotification';

describe('useNotification', () => {
    it('initializes with default state', () => {
        const { result } = renderHook(() => useNotification());
        // Check initial state or basic function
        expect(result.current).toBeDefined();
    });
});
```

## Success Criteria
-   ✅ **Files have co-located tests**: Each logical file (`.ts`, `.tsx`) has a `.test.tsx` or `.test.ts`.
-   ✅ **Coverage**: Aim for >80% coverage.
-   ✅ **Clean**: No `console.log` in tests. Mocks are cleared (`jest.clearAllMocks()`).
-   ✅ **Typed**: Tests are written in TypeScript.
-   ✅ **Passing**: All tests pass with `npm test`.

## Examples of Use

### Example 1: Full Module Test
```
Generate COMPLETE unit tests for `src/components/AppBar/`:

1.  **Analysis**: List all .ts/.tsx files.
2.  **Plan**: Identify which ones need tests (`AppBar.tsx`).
3.  **Execution**:
    -   Create `AppBar.test.tsx`
4.  **Verify**: Run coverage.

Follow the instructions in `EXPO-TEST-SETUP.instructions.md`.
```

### Example 2: Update Existing Test
```
Update tests for `src/components/Button/Button.tsx`. Add test cases for different button variants.
```

---
**Note**: Use this prompt in conjunction with `EXPO-TEST-SETUP.instructions.md`.
