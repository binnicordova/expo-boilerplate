---
name: expo-atomic
description: Implementation and management of Atomic Design methodology in Expo.
version: 1.0.0
license: MIT
---

# Expo Atomic Design Guidelines

This document outlines how the **Atomic Design** methodology is applied within this project to ensure a scalable, maintainable, and highly reusable design system.

## Philosophy

We follow the Atomic Design hierarchy to break down complex UIs into fundamental building blocks. This allows us to develop, test, and document components in isolation before assembling them into full screens.

## The Hierarchy

### 1. Sub-atomic (Design Tokens)
**Location**: `src/theme/`

These are the smallest visual elements that define the app's look and feel. They are not components themselves but are consumed by all atoms and molecules.

*   **Colors**: [src/theme/colors.ts](src/theme/colors.ts)
*   **Spacing**: [src/theme/spacing.ts](src/theme/spacing.ts)
*   **Shadows**: [src/theme/shadow.ts](src/theme/shadow.ts)
*   **Typography**: [src/theme/fonts.ts](src/theme/fonts.ts)
*   **Borders**: [src/theme/border.ts](src/theme/border.ts)

### 2. Atoms
**Location**: `src/components/`

The most basic UI building blocks that cannot be broken down further without losing their functionality.

*   **Characteristics**: High reusability, minimal logic, pure presentation.
*   **Examples**: `Text`, `Icon`, `Badge`, `Divider`.

### 3. Molecules
**Location**: `src/components/`

Simple groups of two or more atoms functioning together as a unit. They often handle simple user interactions.

*   **Characteristics**: Composed of atoms, can have internal state or handle simple callbacks.
*   **Examples**: 
    *   `Input`: (Label atom + TextInput + Error atom)
    *   `Checkbox`: (Icon atom + Text atom)
    *   `Avatar`: (Image atom + Initials atom)

### 4. Organisms
**Location**: `src/components/`

Complex UI components composed of molecules and/or atoms. These form distinct sections of an interface.

*   **Characteristics**: Functional units that can be reused across different screens.
*   **Examples**: `AppBar`, `NewsListItem`, `LoginForm`.

### 5. Templates
**Location**: `src/app/` (Layouts)

Page-level objects that define the layout structure of a screen without being tied to specific content.

*   **Characteristics**: Uses `expo-router` layouts (`_layout.tsx`) to define scaffolding.
*   **Examples**: [src/app/_layout.tsx](src/app/_layout.tsx).

### 6. Pages
**Location**: `src/app/` (Routes)

Specific instances of templates where the UI is rendered with real data and business logic.

*   **Characteristics**: The entry points of the app, connected to stores (Jotai) or services.
*   **Examples**: `index.tsx`, `news.tsx`.

## Workflow for New Components

1.  **Identify the Level**: Determine if the new UI requirement is an Atom, Molecule, or Organism.
2.  **Define Styles**: Use tokens from `src/theme/` in your `.styles.ts`.
3.  **Implement**: Create the component following the Folder-per-Component pattern.
4.  **Document**: Create a `.stories.tsx` file and run `pnpm storybook-generate` to validate visually.
5.  **Test**: Write unit tests in `.test.tsx` to ensure functionality and accessibility.

## Documentation

All components across the atomic spectrum are documented in **Storybook**, which acts as our living design system documentation. Run `pnpm storybook:web` to explore the inventory.
