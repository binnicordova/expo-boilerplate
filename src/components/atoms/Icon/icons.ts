export const ICON_NAMES = [
    "back",
    "forward",
    "certificate",
    "skills",
    "timer",
    "streak",
    "review",
    "badge",
    "success",
    "pending",
    "failure",
    "alert",
    "notification",
    "locked",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
