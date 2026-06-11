import {Modal} from "@mantine/core";
import {useEffect} from "react";

import {useModalsStore} from "@/context/useModalsStore.ts";
import {LOCAL_STORAGE_LAST_SEEN_UPDATE_NEWS_VERSION_KEY} from "@/utils/localStorageKey.ts";
import {getNextUpdateNews, getUpdateNews} from "./updateNewsRegistry.ts";

export function UpdateNews() {
    const {showUpdateNews, setShowUpdateNews} = useModalsStore();
    const activeUpdateNews = getUpdateNews(showUpdateNews);

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem(LOCAL_STORAGE_LAST_SEEN_UPDATE_NEWS_VERSION_KEY);
        const nextUpdateNews = getNextUpdateNews(lastSeenVersion);

        setShowUpdateNews(nextUpdateNews?.version);
    }, [setShowUpdateNews]);

    const closeModal = () => {
        if (!activeUpdateNews) return;

        localStorage.setItem(
            LOCAL_STORAGE_LAST_SEEN_UPDATE_NEWS_VERSION_KEY,
            activeUpdateNews.version,
        );

        const nextUpdateNews = getNextUpdateNews(activeUpdateNews.version);
        setShowUpdateNews(nextUpdateNews?.version);
    };

    const Content = activeUpdateNews?.content;

    return (
        <Modal
            title={`Release notes ${activeUpdateNews?.version}`}
            opened={activeUpdateNews !== undefined}
            onClose={closeModal}
            centered
        >
            {Content && <Content/>}
        </Modal>
    );
}
