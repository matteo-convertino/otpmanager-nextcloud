import {type ReactNode, useEffect} from "react";

import {Box, MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import {Notifications} from "@mantine/notifications";
import {Password} from "./password/Password.tsx";

import type {EmotionCache} from "@emotion/react";
import {useSettingsStore} from "@/context/useSettingsStore";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import PasswordService from "@/services/PasswordService.ts";
import {useSecretStore} from "@/context/useSecretStore.ts";

// get nextcloud theme
let nextcloudTheme: "dark" | "light";
const bodyElement = document.getElementsByTagName("body")[0];
const theme = bodyElement.getAttribute("data-themes") ?? "default";

if (theme.includes("default")) {
    nextcloudTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
} else if (
    theme.includes("light") ||
    bodyElement.classList.contains("theme--light")
) {
    nextcloudTheme = "light";
} else {
    nextcloudTheme = "dark";
}


export const OtpLayout = ({children, myCache, emotionRoot}: {
    children: ReactNode,
    myCache: EmotionCache,
    emotionRoot: HTMLElement
}) => {
    const {darkMode} = useSettingsStore();
    const {setPassword, auth} = useSecretStore();
    const otpManagerApi = useOtpManagerApi();

    useEffect(() => {
        otpManagerApi({
            api: PasswordService.getInstance().get,
            showNotifications: false,
            onComplete: (passwordExists) => setPassword(passwordExists),
        });
    }, []);

    return (
        <MantineProvider
            theme={{
                colorScheme:
                    darkMode === undefined
                        ? nextcloudTheme
                        : darkMode
                            ? "dark"
                            : "light",
                // breakpoints: {
                //     min: 0,
                // },
                components: {
                    Portal: {
                        defaultProps: {
                            target: emotionRoot,
                        },
                    },
                },
            }}
            emotionCache={myCache}
        >
            <Notifications
                position="top-right"
                zIndex={999999}
                sx={{
                    right: "16px", // default
                    maxWidth: "440px", // default
                    top: "calc(50px + 16px)", // 50px (nextcloud header)
                }}
            />
            <ModalsProvider>
                <Box
                    sx={{
                        minHeight: "calc(100vh - 50px)",
                        width: "100%",
                        padding: 0,
                        margin: 0,
                    }}
                >
                    {auth ? children : <Password />}
                </Box>
            </ModalsProvider>
        </MantineProvider>
    );
};
