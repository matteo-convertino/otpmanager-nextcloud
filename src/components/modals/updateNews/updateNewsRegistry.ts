import type {ComponentType} from "react";

import {UpdateNews_1_1_6} from "./UpdateNews_1_1_6.tsx";

export const updateNewsRegistry: {
    version: string;
    content: ComponentType;
}[] = [
    {
        version: "1.1.6",
        content: UpdateNews_1_1_6,
    },
];

export function getUpdateNews(version?: string) {
    return updateNewsRegistry.find((updateNews) => updateNews.version === version);
}

export function getNextUpdateNews(lastSeenVersion: string | null) {
    if (lastSeenVersion === null) return updateNewsRegistry[0];

    const lastSeenIndex = updateNewsRegistry.findIndex(
        (updateNews) => updateNews.version === lastSeenVersion,
    );

    return updateNewsRegistry[lastSeenIndex + 1];
}
