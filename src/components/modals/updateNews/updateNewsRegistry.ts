import type {ModalProps} from "@mantine/core";
import type {ComponentType} from "react";

import {UpdateNews_1_1_6} from "./UpdateNews_1_1_6.tsx";
import {UpdateNews_1_2_1} from "./UpdateNews_1_2_1.tsx";

export const updateNewsRegistry: {
    version: string;
    size: ModalProps["size"];
    content: ComponentType;
}[] = [
    {
        version: "1.1.6",
        size: "md",
        content: UpdateNews_1_1_6,
    },
    {
        version: "1.2.1",
        size: "xl",
        content: UpdateNews_1_2_1,
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
