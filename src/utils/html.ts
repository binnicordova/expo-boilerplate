const ENTITIES: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
};

export const stripHtml = (html: string): string =>
    html
        .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity] ?? " ")
        .replace(/\s+/g, " ")
        .trim();

export const extractCodeBlocks = (html: string): string[] =>
    [...html.matchAll(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi)].map(
        (match) =>
            match[1]
                .replace(/<[^>]+>/g, "")
                .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity] ?? " ")
                .trim()
    );

export const summarize = (html: string, maxLength = 280): string => {
    const text = stripHtml(html);

    if (text.length <= maxLength) {
        return text;
    }

    const clipped = text.slice(0, maxLength);
    const lastStop = Math.max(
        clipped.lastIndexOf(". "),
        clipped.lastIndexOf("? ")
    );

    return lastStop > maxLength * 0.5
        ? clipped.slice(0, lastStop + 1)
        : `${clipped.trimEnd()}…`;
};
