import {type ReactNode, useContext, useEffect, useState} from "react";

import {Box} from "@mantine/core";

import {MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import {Notifications} from "@mantine/notifications";
import {generateUrl} from "@nextcloud/router";
import {Password} from "./utils/Password";

import {UserSettingContext} from "./context/UserSettingProvider";
import type {EmotionCache} from "@emotion/react";

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


export const OtpLayout = ({children, myCache, emotionRoot}: {children: ReactNode, myCache: EmotionCache, emotionRoot: HTMLElement}) => {
    const [userSetting] = useContext(UserSettingContext);
    const [password, setPassword] = useState(null);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        fetch(generateUrl("/apps/otpmanager/password"))
            .then((response) => response.json())
            .then((response) => setPassword(response))
            .catch((error) => setPassword(null));
    }, []);

    return (
        <MantineProvider
            theme={{
                colorScheme:
                    userSetting.darkMode == null
                        ? nextcloudTheme
                        : userSetting.darkMode
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
                    {auth ? children : <Password exists={password} setAuth={setAuth}/>}
                </Box>
            </ModalsProvider>
        </MantineProvider>
    );
};
