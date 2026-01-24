# Workspace Folder Structure

The project is organized to be scalable and maintainable. Below is a detailed breakdown of the `src/` directory.

## `src/` Root

### `app/`
- **Purpose**: File-based routing with Expo Router.
- **Rules**: Only contains routes (`index.tsx`, `news.tsx`) and layouts (`_layout.tsx`). No components or logic.
- **Nesting**: Use groups `(tabs)` and dynamic segments `[id]` as needed.

### `components/`
- **Purpose**: Reusable UI primitives and complex UI blocks.
- **Pattern**: Every component is a folder containing the `.tsx` logic, `.styles.ts` styles, `.stories.tsx` documentation, and `.test.tsx` file.
- **Scope**: Components should be as generic as possible.

### `constants/`
- **Purpose**: Configuration and non-changing values.
- **Files**:
  - `env.ts`: API keys and URLs.
  - `routes.ts`: Type-safe route names.
  - `storage.ts`: Keys used for `AsyncStorage`.
  - `strings.ts`: Hardcoded strings/localization.

### `hooks/`
- **Purpose**: Shared logic across multiple components or screens.
- **Naming**: Always prefix with `use` (e.g., `useNotification.ts`).

### `models/`
- **Purpose**: Single source of truth for TypeScript types and interfaces.
- **Usage**: Exported types are used across stores, services, and components.

### `services/`
- **Purpose**: External communication.
- **Sub-folders**:
  - `mocks/`: Static JSON files for simulated backend responses.
- **Key Files**:
  - `http.ts`: Generic HTTP wrapper (fetch/axios).
  - `api.ts`: Shared instance of the API client with business logic mappings.

### `stores/`
- **Purpose**: Global state management using **Jotai**.
- **Organization**: Group related atoms into logic-specific files (e.g., `articlesStore.ts`).

### `styles/`
- **Purpose**: Global style definitions, base views, and CSS-like abstractions that don't belong to a specific component.

### `theme/`
- **Purpose**: Design system tokens.
- **Tokens**: `colors.ts`, `spacing.ts`, `fonts.ts`, `border.ts`, `opacity.ts`.
- **Injection**: Theme is accessible via functions to allow for future multi-theme support.

### `utils/`
- **Purpose**: Pure function helpers.
- **Domain**: `storage.ts`, `matcher.ts`, `cache.ts`, `notification.ts`.
