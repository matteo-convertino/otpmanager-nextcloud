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


export const OtpLayout = ({children, emotionCache, mantinePortalTarget, mantineDrawerTarget}: {
    children: ReactNode,
    emotionCache: EmotionCache,
    mantinePortalTarget: HTMLElement
    mantineDrawerTarget: HTMLElement
}) => {
    const {darkMode} = useSettingsStore();
    const {setPassword, auth} = useSecretStore();
    const otpManagerApi = useOtpManagerApi();

    useEffect(() => {
        otpManagerApi({
            api: PasswordService.getInstance().status,
            showNotifications: false,
            onComplete: (passwordResponseStatusDto) => setPassword(passwordResponseStatusDto.hasPassword),
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
                components: {
                    Portal: {
                        defaultProps: {
                            target: mantinePortalTarget,
                        },
                    },
                    Drawer: {
                        defaultProps: {
                            target: mantineDrawerTarget,
                        },
                        styles: {
                            inner: {
                                top: "50px",
                                right: "0px"
                            },
                        }
                    }
                },
            }}
            emotionCache={emotionCache}
        >
            <Notifications
                position="top-right"
                zIndex={999999}
                sx={{
                    right: "16px", // default
                    maxWidth: "440px", // default
                    top: "calc(50px + 16px)", // 50px (nextcloud header)
                }}
                notificationMaxHeight={"100%"}
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
                    {auth ? children : <Password/>}
                </Box>
            </ModalsProvider>
        </MantineProvider>
    );
};
