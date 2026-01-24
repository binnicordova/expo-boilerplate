---
name: expo-architect
description: Modular architecture and technical standards for Expo with Jotai, Expo Router, and Biome.
version: 1.0.0
license: MIT
---

# Expo Architecture Guidelines

## References

Consult these resources for detailed implementation patterns:

- ./references/folder-structure.md -- Deep dive into the `src/` directory organization.
- ./references/state-management.md -- Best practices for Jotai atoms and persistence.
- ./references/component-standards.md -- Standards for UI components, styling, and testing.

This document outlines the architectural patterns and technical standards used in this boilerplate.

## Architecture Overview

The project follows a modular architecture that separates concerns into clear layers:

- **Presentation Layer**: React components and Expo Router screens.
- **State Management Layer**: Atoms (Jotai) and Stores.
- **Service Layer**: API clients and HTTP abstractions.
- **Data Layer**: Models (Types) and Mocks.
- **Utility Layer**: Helper functions and cross-cutting concerns.
- **Design System**: Theme-based styling and design tokens.

## Folder Structure (`src/`)

- `app/`: Expo Router routes and layouts. Handles file-based navigation.
- `components/`: Reusable UI components. Each component should be in its own folder.
- `constants/`: Global constants (Environment variables, Storage keys, Strings).
- `hooks/`: Custom React hooks for shared logic.
- `models/`: TypeScript interfaces and types (Data models).
- `services/`: API integration and external service handlers.
- `stores/`: Jotai atoms for global and persistent state.
- `styles/`: Global styles and styled-component-like abstractions.
- `tasks/`: Background tasks and cron-like jobs.
- `theme/`: Design tokens (Colors, Spacing, Fonts, Opacity, Border).
- `utils/`: Low-level utility functions (Storage, Cache, Matchers).

## State Management (Jotai)

We use **Jotai** for atomic state management.

- **Atoms**: Define atoms in `src/stores/`.
- **Naming**: Use `Atom` suffix for atom variables (e.g., `articlesAtom`).
- **Persistence**: Use `atomWithStorage` for data that should persist across app reloads.
- **Computed Atoms**: Use read-only or read-write atoms for derived state to keep logic out of components.

Example:
```typescript
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const countAtom = atom(0);
export const persistentCountAtom = atomWithStorage('count', 0);
```

## Component Pattern

Each component should follow the "Folder-per-Component" pattern:

```
src/components/MyComponent/
├── MyComponent.tsx           # Implementation
├── MyComponent.styles.ts     # StyleSheet definitions
├── MyComponent.stories.tsx    # Storybook documentation
└── MyComponent.test.tsx      # Unit tests (Co-located)
```

- **Styling**: Always separate styles from implementation using `.styles.ts`.
- **Theme**: Use the `theme()` function from `@/theme/colors` inject colors.
- **PascalCase**: Folders and implementation files must use PascalCase (e.g., `AppBar.tsx`).
- **Co-location**: Keep tests and stories next to the code.

## Service Layer

- **HTTP Client**: Use the abstracted `http` utility for base requests.
- **API Services**: Define business-specific API calls in `src/services/api.ts`.
- **Mocks**: Store mock data in `src/services/mocks/` for development and testing.

## Routing (Expo Router)

- Keep `app/` files lean. Delegate logic to hooks or stores.
- Use `_layout.tsx` for shared UI (Headers, Providers, Sidebars).
- Use `Slot` or `Stack` depending on the navigation needs.

## Code Standards

- **Formatting**: We use **Biome**. Run `pnpm format` to ensure code style compliance.
- **TypeScript**: Use path aliases (`@/`) to avoid deep relative paths (e.g., `../../../../utils`).
- **Unit Testing**: 
  - Mandatory for components with logic, hooks, and stores.
  - Follow `EXPO-TEST-SETUP.instructions.md`.
  - Use `@testing-library/react-native`.

## Design System

- Do not use hardcoded colors. Use `theme()` from `src/theme/colors.ts`.
- Use design tokens from `src/theme/` (spacing, fonts, etc.) for consistency.
- Prefer `expo-image` over native `Image` for better caching and performance.
