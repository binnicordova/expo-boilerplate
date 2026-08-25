import type {Difficulty, Domain} from "@/models/assessment";
import type {ChallengeDefinition, SkillNode} from "@/models/progression";

export const DOMAINS: Domain[] = [
    "react",
    "react-native",
    "typescript",
    "architecture",
    "node",
];

export const DOMAIN_LABEL: Record<Domain, string> = {
    react: "React",
    "react-native": "React Native",
    typescript: "TypeScript",
    architecture: "System Architecture",
    node: "Node.js",
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
    0: "Foundation",
    1: "Professional",
    2: "Expert",
};

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
    0: 10,
    1: 20,
    2: 35,
};

export const XP_PER_LEVEL = 250;
export const STREAK_BONUS_PER_DAY = 0.05;
export const MAX_STREAK_MULTIPLIER = 2;

export const ADAPTIVE_WINDOW = 4;
export const PROMOTE_ACCURACY = 0.75;
export const DEMOTE_ACCURACY = 0.4;

export const REVIEW_EASE_FLOOR = 1.3;
export const REVIEW_EASE_DEFAULT = 2.5;
export const REVIEW_INTERVALS = [1, 3, 7, 16, 35];

export const MASTERY_TIERS: {
    tier: "bronze" | "silver" | "gold";
    min: number;
}[] = [
    {tier: "gold", min: 0.9},
    {tier: "silver", min: 0.75},
    {tier: "bronze", min: 0.6},
];

export const MASTERY_MIN_SAMPLE = 5;

export const CHALLENGES: ChallengeDefinition[] = [
    {
        id: "rapid-debug-60",
        domain: "react",
        label: "60s Rapid Debugging",
        durationSeconds: 60,
        questionCount: 6,
        passingStreak: 4,
    },
    {
        id: "typescript-sprint-90",
        domain: "typescript",
        label: "90s TypeScript Sprint",
        durationSeconds: 90,
        questionCount: 8,
        passingStreak: 5,
    },
    {
        id: "architecture-drill-120",
        domain: "architecture",
        label: "120s Architecture Drill",
        durationSeconds: 120,
        questionCount: 6,
        passingStreak: 4,
    },
];

export const SKILL_TREE: SkillNode[] = [
    {
        id: "react-fundamentals",
        domain: "react",
        label: "React Fundamentals",
        dependsOn: [],
        masteryRequired: 0.6,
    },
    {
        id: "react-hooks",
        domain: "react",
        label: "Hooks & Effects",
        dependsOn: ["react-fundamentals"],
        masteryRequired: 0.65,
    },
    {
        id: "typescript-generics",
        domain: "typescript",
        label: "TypeScript Generics",
        dependsOn: ["react-fundamentals"],
        masteryRequired: 0.7,
    },
    {
        id: "state-machines",
        domain: "architecture",
        label: "State Machines",
        dependsOn: ["react-hooks", "typescript-generics"],
        masteryRequired: 0.7,
    },
    {
        id: "rendering-performance",
        domain: "react-native",
        label: "Rendering Performance",
        dependsOn: ["react-hooks"],
        masteryRequired: 0.7,
    },
    {
        id: "native-modules",
        domain: "react-native",
        label: "Native Modules",
        dependsOn: ["state-machines", "rendering-performance"],
        masteryRequired: 0.75,
    },
    {
        id: "streaming-ssr",
        domain: "node",
        label: "Streaming SSR",
        dependsOn: ["state-machines"],
        masteryRequired: 0.75,
    },
];
