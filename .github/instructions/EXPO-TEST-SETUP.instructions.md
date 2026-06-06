---
applyTo: 'src/**/*.{ts,tsx}'
description: 'Instructuions for Unit Testing and Coverage in React Native / Expo - version 1.0.1'
version: '1.0.1'
category: 'test'
language: 'typescript'
---

# Instructions for Unit Testing and Coverage (React Native / Expo)

These instructions allow any developer to generate unit tests and measure code coverage in the React Native / Expo project, following the defined standard.

## 1. File Location and Convention
- Tests must be **co-located** with the file they are testing.
- The naming convention is `<filename>.test.tsx` or `<filename>.test.ts`.
- Example:
    - `src/components/Button/Button.tsx` -> `src/components/Button/Button.test.tsx`
    - `src/utils/matcher.ts` -> `src/utils/matcher.test.ts`
- Mocks should be placed in a `__mocks__` folder or inside a specific `mocks/` folder if it's a large module.

### 1.1 Mandatory Structure Analysis (CRITICAL)

⚠️ **BEFORE creating tests, a complete analysis of the module structure MUST be performed**:

#### Step 1: List ALL files
```bash
# Example for a specific folder
find src/components/Button -name "*.{ts,tsx}" | grep -v node_modules | grep -v coverage | grep -v ".test." | grep -v ".stories."
```

#### Step 2: Create analysis file
Create `TEST-COVERAGE-ANALYSIS.md` in the root of the module being tested (or temporary location) with:

1. **Complete list of files** with their path.
2. **State of each file**: Tested ✅ | Pending ❌ | Not required ⏭️.
3. **Justification** for files without tests.
4. **Coverage metrics**: X/Y files tested (Z%).
5. **Prioritized Action Plan**.

#### Step 3: Classify files

**Files that ALWAYS require tests:**
- Components with logic or user interaction (`*.tsx`).
- Custom Hooks (`use*.ts`).
- Utils / Helpers (`utils/*.ts`, `matcher.ts`, etc.).
- Stores (`stores/*.ts`).
- Services (`services/*.ts`).

**Files that MAY NOT require tests:**
- `index.ts` files that only export other modules.
- Types/Interfaces definitions (`*.d.ts`, `types.ts`, `models/*.ts`).
- Styles files (`*.styles.ts`) if they don't contain logic.
- Storybook files (`*.stories.tsx`).
- Constants files (`constants/*.ts`).

### 1.2 Complete Test Structure

The tests must be located next to the implementation files.
Example based on `src/components/AppBar/`:

```
src/components/AppBar/
├── AppBar.tsx            → AppBar.test.tsx
├── AppBar.styles.ts      → (No test required usually)
└── AppBar.stories.tsx    → (No test required)
```

## 2. Tools
- **Jest**: Test runner and assertion library (`jest-expo`).
- **React Native Testing Library (RNTL)**: For rendering components and interacting with them (`@testing-library/react-native`).
- **Biome**: For linting and formatting (replaces ESLint/Prettier).

## 3. Configuration

### 3.1 Jest Configuration
Configuration is located in `jest.config.ts`. It uses the `jest-expo` preset.

### 3.2 NPM Scripts
```json
{
  "scripts": {
    "test": "jest --watch --coverage=false --changedSince=origin/main",
    "test:coverage": "jest --coverage",
    "testFinal": "bunx jest"
  }
}
```

### 3.3 Files to Ignore
Ensure `coverage/`, `.expo/` and `node_modules` are in `.gitignore`.

## 4. Example of Test Creation

### 4.1 Component Test (RNTL)

```tsx
// src/components/Button/Button.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly with label', () => {
    render(<Button label="Click me" onPress={() => {}} />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPressMock = jest.fn();
    render(<Button label="Press" onPress={onPressMock} />);
    
    fireEvent.press(screen.getByText('Press'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

### 4.2 Hook Test

```tsx
// src/hooks/useUpdates.test.ts
import { renderHook, act } from '@testing-library/react-native';
import * as Updates from 'expo-updates';
import { useUpdates } from './useUpdates';

jest.mock('expo-updates');

describe('useUpdates Hook', () => {
  it('checks for updates', async () => {
    const { result } = renderHook(() => useUpdates());
    // ... logic for testing updates
  });
});
```

### 4.3 Service/Utils Test

```ts
// src/utils/matcher.test.ts
import { match } from './matcher';

describe('matcher utils', () => {
  it('matches correctly', () => {
    // expect(match(...)).toBe(...);
  });
});
```

### 4.4 Mocking External Dependencies

```tsx
// Mocking API service
jest.mock('../../services/api', () => ({
  getNews: jest.fn(),
}));

// In the test
import { getNews } from '../../services/api';

it('calls api', async () => {
    // ... trigger action
    expect(getNews).toHaveBeenCalled();
});
```

## 5. Execution

- Run all tests: `npm run testFinal`
- Run with coverage: `npm run test:coverage`
- Watch mode: `npm test`

## 6. Coverage Goals
- Aim for **80% coverage** in Statements, Branches, Functions, and Lines for critical business logic and complex components.
- Review the `coverage/lcov-report/index.html` file to identify uncovered lines.
