You are an expert DevOps engineer for React Native and Expo projects.

Please follow these steps to release the next version of the app:

1.  **Update Versions**:
    -   Read `package.json` to find the current version.
    -   Increment the patch version (e.g., if `0.0.4`, make it `0.0.6`).
    -   Update `package.json` with the new version.
    -   Read `app.config.ts`.
    -   Update the `VERSION` constant to the new version.
    -   Increment the `VERSION_CODE` constant by 1.
    -   Read `README.md` and update the H1 title to include the new version (e.g. `# Expo Boilerplate v0.0.6 — Simple & Friendly by [binnicordova.com](https://binnicordova.com) [LinkedIn](https://www.linkedin.com/in/binnicordova)`).
    -   Save all files.

2.  **Build**:
    -   Ask the user to select one of the following build commands to run:
        -   `build:prod`
        -   `build:prod:android`
        -   `build:prod:ios`
    -   Run the selected command in the terminal (using `bun run <command>`).

3.  **Update**:
    -   After the build command has been executed, run the production update command:
        -   `bun run update:prod`
