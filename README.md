![Expo React Native Boilerplate](./resources/expo-rn-boilerplate_bcordova.gif)

# Expo Boilerplate v0.0.6 — Simple & Friendly by [binnicordova.com](https://binnicordova.com) [LinkedIn](https://www.linkedin.com/in/binnicordova)

Crafted by an Expo developer with over 8 years of experience, this is a short, easy-to-understand starter for building mobile apps with Expo + React Native. Version **v0.0.6** now includes built-in **AI Agent Skills** designed to accelerate development, control AI generation for higher quality output, and enforce clean code standards automatically. 

**Who is this for?**
- Product people and designers who want a quick overview.
- Developers who need a ready-to-use project with AI-superpowers.

## Quick start

1. Create your new app from this template (keeps `.github`, removes git history):

```sh
git clone --depth 1 https://github.com/binnicordova/expo-boilerplate.git my-app && cd my-app && rm -rf .git && git init
```

> This is the recommended way for this repository template: you keep AI Skills, prompts, and instruction files, and start your own fresh git repository with no previous commits.

If you use `create-expo --template`, some template files (including AI setup under `.github`) can be skipped:

```sh
pnpx create-expo --template https://github.com/binnicordova/expo-boilerplate
```

2. Install dependencies:

```sh
pnpm install
```

3. Run and preview on your iPhone or Android device (scan the QR in Expo Go):

```sh
pnpm start
```

## tvOS Support (Apple TV)

This boilerplate is now tvOS-safe at runtime (notifications and background tasks are disabled on TV devices).

- Expo Go does not run on Apple TV (tvOS).
- Use a Development Build for TV testing.
- Keep using the same codebase for iOS, Android, Web, and tvOS.

Recommended TV flow:

```sh
pnpm install
pnpm ios
```

Then select an Apple TV simulator/device from Xcode tooling when launching the iOS native project.

## Helpful commands

- **Preview on a device**: `pnpm run eas-preview`
- **Run component stories**: `pnpm run storybook:start`
- **Browse stories on the web**: `pnpm run storybook:web` 🌐
- **Run tests**: `pnpm run test`

## Where to look in the code (Project Structure)

This project follows a clear and scalable structure inside the `src/` directory:

- 📂 **Main code**: `src/`
- 📱 **App screens**: `src/app/` (Expo Router file-based routing)
- 🧩 **Shared components**: `src/components/` (Reusable UI elements)
- 📦 **State management**: `src/stores/` (Global state using Jotai)
- 🎣 **Hooks**: `src/hooks/` (Custom React hooks)
- 🎨 **Theme & Styles**: `src/theme/` and `src/styles/` (Design tokens and global styles)
- 🛠️ **Utils**: `src/utils/` (Helper functions)

## Technical Stack Details (Architecture)

This project is built with a modern and robust stack:

- **Framework**: Expo / React Native
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **State Management**: Jotai (Atomic state)
- **Styling**: Styled Components / StyleSheet
- **Testing**: Jest

## Deployment (AppStore / PlayStore / Web)

When you’re ready to publish, use **EAS (Expo Application Services)**:

**Build for Production:**
```sh
pnpm run build:prod
```

**Update over the Air (OTA):**
```sh
pnpm run update:prod
```

## Reset Project & Tools

**Reset the Project:**
To reset the project and remove all example code, run the following command:
```sh
pnpm run reset-project
```

**Generate Assets:**
Generate the Assets to the app and Stores with simple script:
```sh
pnpm run generate:branding
```

## 🤖 AI Agent Skills & Automation

This boilerplate is uniquely optimized for AI-assisted development. It includes **Specialized Agent Skills** (located in `.github/skills/`) that teach your AI assistant (Copilot, Cursor, etc.) how to:

- 🚀 **Accelerate Coding**: Get from idea to implementation faster with domain-specific knowledge.
- 🎯 **Control Generation**: Ensure the AI follows the exact technical standards of this project (Jotai, Expo Router, Biome).
- 🧹 **Perform Clean Code**: Automatic enforcement of modular architecture and technical debt prevention.
- ⏱️ **Save Time**: Reduce manual research by providing the AI with immediate project context.

### How to use
Use the AI powerups by typing "#" and selecting the prompt or skill in your AI chatbox editor:

```
#expo-architect       - Modular architecture and technical standards
#building-ui          - Guide for Native UI, animations, and icons
#api-routes           - Serverless API development workflows
#deployment           - App Store and Play Store submission guide
#upgrading-expo       - SDK update patterns and dependency fixes
```

**Automation Prompts:**
```
#EXPO-RELEASE-NEXT-VERSION.prompt.md
#EXPO-TEST-CREATE.prompt.md
#EXPO-DOC-README-CREATE.prompt
```

## 📬 Connect with Binni Cordova

PortFolio
- [binnicordova.com](https://binnicordova.com)

Feel free to reach out if you have any questions or need support. Call [ +1 (650) 374-4225 ](tel:+16503744225) and ask for Binni Cordova.

Contact him:
- [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-%230072b1?logo=linkedin)](https://www.linkedin.com/in/binnicordova)
- [![Calendar](https://img.shields.io/badge/Calendar-Book%20a%20Meeting-%23FF7F50?logo=google-calendar)](https://calendly.com/binnizenobiocordovaleandro/meet)
- [![GitHub](https://img.shields.io/badge/GitHub-Profile-%23808080?logo=github)](https://github.com/binnizenobiocordovaleandro)
- [![Email](https://img.shields.io/badge/Email-Send%20Mail-%23FF5722?logo=gmail)](mailto:binnizenobiocordovaleandro@gmail.com)
- [![Phone](https://img.shields.io/badge/Phone-Call-%234CAF50?logo=phone)](tel:+1-650-374-4225)

