![Expo React Native Boilerplate](./resources/expo-rn-boilerplate_bcordova.gif)

# Expo Boilerplate v0.0.4 — Simple & Friendly by [binnicordova.com](https://binnicordova.com) [LinkedIn](https://www.linkedin.com/in/binnicordova)

A short, easy-to-understand starter for building mobile apps with Expo + React Native. It includes common tools so teams can move faster without dealing with setup details.

**Who is this for?**
- Product people and designers who want a quick overview.
- Developers who need a ready-to-use project.

## Quick start

1. Use the template to create a new Expo project:

```sh
pnpx create-expo --template https://github.com/BinniZenobioCordovaLeandro/expo-boilerplate_binnicordova
```

2. Install dependencies:

```sh
pnpm install
```

3. Run and preview on your iPhone or Android device (scan the QR in Expo Go):

```sh
pnpm start
```

## Helpful commands

- **Preview on a device**: `pnpm run eas-preview`
- **Run component stories**: `pnpm run storybook:start`
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

## 🤖 AI automation prompts

Use the AI powerups tipying "#" and the prompt into your AI chatbox editor:

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

