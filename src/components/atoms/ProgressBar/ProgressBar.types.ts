export type ProgressBarProps = {
    progress: number;
    color?: string;
    trackColor?: string;
    testID?: string;
};

export const clampProgress = (progress: number) =>
    Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
