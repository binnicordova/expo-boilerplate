# Prompt for Technical README Generation (React Native / Expo)

This prompt is designed to facilitate the creation or update of the `README.md` file for React Native / Expo projects. The README must be clear, detailed, and structured for developers. It must be written in **English**.

## Recommended README.md Structure

The structure should follow the formatting and sections of the provided example, preserving the specific branding and contact information.

1.  **Header & Branding (Preserve Existing)**
    *   **Title**: Expo Boilerplate — Simple & Friendly by [binnicordova.com](https://binnicordova.com).
    *   **Badges/Links**: Simplify access to LinkedIn and Website.
    *   **Description**: A short, easy-to-understand starter for Expo + React Native.
    *   **Target Audience**: Product people, designers, and developers.

2.  **Quick Start**
    *   Sequential steps for getting started quickly using `pnpm`.
    *   **Create Project**: `pnpx create-expo --template ...`
    *   **Install**: `pnpm install`
    *   **Run**: `pnpm start` (with instructions to scan QR code).

3.  **Helpful Commands**
    *   List specific useful commands identified in `package.json`.
    *   Examples: `pnpm run eas-preview`, `pnpm run storybook:start`.

4.  **Project Structure (Where to look in the code)**
    *   Map the file system to a user-friendly guide.
    *   **Main code**: `src/`
    *   **App screens**: `src/app/`
    *   **Shared components**: `src/components/`
    *   **State**: `src/stores/`
    *   **Hooks**: `src/hooks/`
    *   **Theme**: `src/theme/` (or `styles/`)

5.  **Technical Stack Details (Architecture)**
    *   **Framework**: Expo / React Native.
    *   **Language**: TypeScript.
    *   **State Management**: Jotai.
    *   **Navigation**: Expo Router.
    *   **Styling**: Styled Components / StyleSheet / Theme tokens.

6.  **Deployment (AppStore / PlayStore / Web)**
    *   **Build**: Instructions for EAS Build (`pnpm run build:prod`).
    *   **Updates (OTA)**: Instructions for EAS Update (`pnpm run update:prod`).

7.  **Reset Project & Tools**
    *   Instructions for the custom reset script: `pnpm run reset-project`.
    *   Instructions for asset generation: `pnpm run generate:branding`.

8.  **Connect & Support (Preserve Existing)**
    *   **Portfolio**: Link to binnicordova.com.
    *   **Contact Info**: Phone number, LinkedIn, Calendar, GitHub, Email badges/links.
    *   **Note**: Ensure the contact section for "Binni Cordova" is preserved exactly as is.

## Acceptance Criteria

*   The README.md must be in **English**.
*   **Preserve Branding**: Do NOT remove the "Binni Cordova" header, footer, or contact details.
*   **Preserve Custom Scripts**: Ensure `reset-project` and `generate:branding` commands are documented.
*   It must reflect the actual structure (`src/`, `assets/`) and scripts from `package.json`.
*   Instructions must be copy-pasteable and verifyable (prefer `pnpm`).

## Usage Example

```
Generate a technical README.md for the current Expo project.
Analyze `package.json` to identify scripts and dependencies.
Preserve the custom headers and contact information for Binni Cordova.
Document the `src/` structure based on the current file system.
Include instructions for EAS Build, OTA Updates, and the custom reset/generate scripts.
```
