#!/usr/bin/env node

/**
 * This script resets the project to a blank state by moving or deleting key folders
 * and scaffolding a minimal `src/app` with `index.tsx`.
 */
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const {execSync} = require("node:child_process");

const root = process.cwd();
// Files and directories to move/delete
const oldPaths = [
    "src/app/news.tsx",
    "src/components/TabButton",
    "src/components/NewsListItem",
    "src/models/article.ts",
    "src/models/category.ts",
    "src/services/api.ts",
    "src/services/mocks/categories.json",
    "src/services/mocks/news.json",
    "src/utils/matcher.ts",
    "src/stores/categoriesStore.ts",
    "src/stores/articlesStore.ts",
];
const exampleDir = "project-example";
const examplePath = path.join(root, exampleDir);
const newAppDir = "src/app";
const newAppPath = path.join(root, newAppDir);

console.log(`
🎸 Hi, I'm Binni Cordova, a rockstar developer with over 7 years of experience working with ReactNative Apps!.
Feel free to use my incredible Expo Boilerplate and contact me to support your ideas or projects.
Let me help you reset this project to a clean state, with a minimal setup, so:
`);

// Content for .env.example file
const envExampleContent = `EXPO_PUBLIC_STORYBOOK_ENABLED=false

# Publish it to GITHUB Actions secrets
EAS_OWNER=your_eas_owner_here
EAS_PROJECT_ID=your_eas_project_id_here
EXPO_TOKEN=your_expo_token_here
`;

// Import centerLayer style from src/styles/index.tsx
const indexContent = `import {router} from "expo-router";
import {View} from "react-native";
import {Button} from "@/components/Button/Button";
import {Text} from "@/components/Text/Text";
import {PATHS} from "@/constants/routes";
import {styles} from "@/styles";

export default function Index() {
    return (
        <View style={styles.centerLayer}>
            <Text type="title">Welcome to Boilerplate Expo</Text>
            <Text type="subtitle">by Binni Cordova</Text>
            <Text type="default">
                I poured my 7+ years of mobile development expertise into
                crafting this boilerplate: a production-ready Expo starter
                complete with background tasks, push notifications, Storybook
                integration, automated testing, formatting, and CI/CD workflows.
                It’s designed to help you ship robust apps faster—so you can
                focus on features, not setup. It’s also fully compatible as a
                foundation for AI-assisted development, making it an excellent
                baseline for AI-driven workflows.
            </Text>

            <Button
                title="Connect on LinkedIn"
                onPress={() =>
                    router.push(
                        PATHS.WEB(
                            "https://www.linkedin.com/in/binni-cordova-a77000175/",
                            "Binni Cordova + Expert Mobile Developer"
                        )
                    )
                }
            />
        </View>
    );
}
`;

// Content for tasks index file
const tasksContent = `import * as BackgroundTask from "expo-background-task";
import { scheduleLocalNotification } from "@/utils/notification";

export const localNotificationTask = async () => {
    scheduleLocalNotification("Hello There!", "This is a test notification.", {});
    return BackgroundTask.BackgroundTaskResult.Success;
};
`;

// Content for background fetch hook
const backgroundFetchContent = `import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { localNotificationTask } from "@/tasks";

const TASK_NAME = "local-notification";
const TASK_INTERVAL = 60 * 60 * 24;
const TASK_CONFIGURATION = { minimumInterval: TASK_INTERVAL };

TaskManager.defineTask(TASK_NAME, localNotificationTask);

export const initBackgroundFetch = async () => {
    await BackgroundTask.registerTaskAsync(TASK_NAME, TASK_CONFIGURATION);
};
`;
// Content for routes constant file
const routesContent = `import type {Href} from "expo-router";

type WebPath = (uri: string, title: string) => Href;

interface PathsProps {
    HOME: Href;
    WEB: WebPath;
}

export const PATHS: PathsProps = {
    HOME: "/",
    WEB: (uri, title) =>
        \`/web?uri=\${encodeURIComponent(uri)}&title=\${encodeURIComponent(title)}\`,
};
`;
// Content for strings constant file
const stringsContent = `export const STRINGS = {
    notification: {
        alert_permission_title: "Push Notification Permission",
        alert_permission_message:
            "Please enable push notifications in your device settings.",
        alert_permission_button: "OK",
    },
    web: {
        invalid_url: "Invalid URL",
    },
};
`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askYesNo = (question, defaultYes = true) =>
    new Promise((resolve) => {
        rl.question(question, (answer) => {
            const trimmed = answer.trim().toLowerCase();
            if (!trimmed) {
                resolve(defaultYes);
                return;
            }
            if (trimmed === "y" || trimmed === "yes") {
                resolve(true);
                return;
            }
            if (trimmed === "n" || trimmed === "no") {
                resolve(false);
                return;
            }
            console.log("Oops! Please enter Y or n so I know what to do. 😊");
            resolve(askYesNo(question, defaultYes));
        });
    });

async function moveOrDelete(shouldBackup) {
    if (shouldBackup) {
        await fs.promises.mkdir(examplePath, {recursive: true});
        console.log(`📁  Created backup folder: /${exampleDir}`);
    }

    for (const relPath of oldPaths) {
        const absPath = path.join(root, relPath);
        if (fs.existsSync(absPath)) {
            if (shouldBackup) {
                const target = path.join(examplePath, relPath);
                await fs.promises.mkdir(path.dirname(target), {
                    recursive: true,
                });
                await fs.promises.rename(absPath, target);
                console.log(
                    `➡️  Moved: ${relPath} → ${path.relative(root, target)}`
                );
            } else {
                await fs.promises.rm(absPath, {
                    recursive: true,
                    force: true,
                });
                console.log(`🗑️  Deleted: ${relPath}`);
            }
        } else {
            console.log(`⚠️  Not found (skipped): ${relPath}`);
        }
    }

    // Scaffold new app folder
    await fs.promises.mkdir(newAppPath, {recursive: true});
    console.log(`📁  Created: ${newAppDir}`);

    // Write index file
    await fs.promises.writeFile(
        path.join(newAppPath, "index.tsx"),
        indexContent
    );
    console.log("📝  Created: src/app/index.tsx");

    // Update tasks index to simple local notification task
    await fs.promises.writeFile(
        path.join(root, "src", "tasks", "index.ts"),
        tasksContent
    );
    console.log("📝  Updated: src/tasks/index.ts");

    // Update background fetch hook to use localNotificationTask
    await fs.promises.writeFile(
        path.join(root, "src", "hooks", "useBackgroundFetch.ts"),
        backgroundFetchContent
    );
    console.log("📝  Updated: src/hooks/useBackgroundFetch.ts");

    // Update routes definitions
    await fs.promises.writeFile(
        path.join(root, "src", "constants", "routes.ts"),
        routesContent
    );
    console.log("📝  Updated: src/constants/routes.ts");

    // Update strings definitions
    await fs.promises.writeFile(
        path.join(root, "src", "constants", "strings.ts"),
        stringsContent
    );
    console.log("📝  Updated: src/constants/strings.ts");

    // Create .env.example file
    await fs.promises.writeFile(
        path.join(root, ".env.example"),
        envExampleContent
    );
    console.log("📝  Created: .env.example");
}

async function resetGitRepo() {
    const gitDir = path.join(root, ".git");
    if (fs.existsSync(gitDir)) {
        await fs.promises.rm(gitDir, {recursive: true, force: true});
        console.log("🧹  Removed existing .git directory.");
    }
    const execOptions = {stdio: "inherit"};
    execSync("git init", execOptions);
    execSync("git add -A", execOptions);
    execSync('git commit -m "Initialize clean project"', execOptions);
}

async function main() {
    try {
        const backupChoice = await askYesNo(
            "Would you like to move existing folders to /project-example for safekeeping? (Y/n): ",
            true
        );
        console.log("Awesome! Let's get your project reset. 🚀");
        await moveOrDelete(backupChoice);

        const gitChoice = await askYesNo(
            "Would you like to reset the git history and create a fresh initial commit? (y/N): ",
            false
        );
        if (gitChoice) {
            await resetGitRepo();
        }

        console.log("\n✅  Project reset complete!");
        if (backupChoice)
            console.log(
                `🗂️  Your old files are safely in /${exampleDir}. Delete it when you're done referencing.`
            );
        if (gitChoice) {
            console.log("🔐  Git history reset with an initial commit.");
        } else {
            console.log("🧱  Git history was left intact.");
        }
        console.log(`
🚀  Run

\`bun start\`

to begin your fresh project with this minimal setup.
Enjoy building with my Expo Boilerplate! 🎉
`);
    } catch (err) {
        console.error(`❌  Error: ${err.message}`);
    } finally {
        rl.close();
    }
}

main();
