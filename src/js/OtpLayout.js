import React, { useState, useEffect, useContext } from "react";

import { Box } from "@mantine/core";

import { MantineProvider, createEmotionCache } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { Password } from "./Password";

import { UserSettingContext } from "./utils/UserSettingProvider";

// get nextcloud theme
var nextcloudTheme = "dark";
const bodyElement = document.getElementsByTagName("body")[0];
const theme = bodyElement.getAttribute("data-themes");

if (theme.includes("default")) {
  nextcloudTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
} else if (
  bodyElement.getAttribute("data-themes").includes("light") ||
  bodyElement.classList.contains("theme--light")
) {
  nextcloudTheme = "light";
}

export const OtpLayout = ({ children, myCache, emotionRoot }) => {
  const [userSetting, setUserSetting] = useContext(UserSettingContext);
  const [password, setPassword] = useState(null);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    fetch("/apps/otpmanager/password")
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
        breakpoints: {
          min: 0,
        },
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
      <NotificationsProvider
        position="top-right"
        zIndex={999999}
        sx={{
          right: "16px", // default
          maxWidth: "440px", // default
          top: "calc(50px + 16px)", // 50px (nextcloud header)
        }}
      >
        <ModalsProvider>
          <Box
            sx={{
              minHeight: "calc(100vh - 50px)",
              width: "100%",
              padding: 0,
              margin: 0,
            }}
          >
            {auth ? children : <Password exists={password} setAuth={setAuth} />}
          </Box>
        </ModalsProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
};
