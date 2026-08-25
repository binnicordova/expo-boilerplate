import type {Href} from "expo-router";

type WebPath = (uri: string, title: string) => Href;

interface PathsProps {
    HOME: Href;
    NEWS: Href;
    SKILLS: Href;
    CHALLENGE: Href;
    EXAM: Href;
    WEB: WebPath;
}

export const PATHS: PathsProps = {
    HOME: "/",
    NEWS: "/news",
    SKILLS: "/skills",
    CHALLENGE: "/challenge",
    EXAM: "/exam",
    WEB: (uri, title) =>
        `/web?uri=${encodeURIComponent(uri)}&title=${encodeURIComponent(title)}`,
};
