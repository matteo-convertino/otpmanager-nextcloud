import React from "react";
import { createRoot } from "react-dom/client";

import { MantineProvider, createEmotionCache } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import { OtpLayout } from "./js/OtpLayout";
import AppShell from "./js/appShell/AppShell";

//creates the shadow dom
const element = document.createElement("div");
const shadowRoot = element.attachShadow({ mode: "open" });
const emotionRoot = document.createElement("div");

shadowRoot.appendChild(emotionRoot);

document.getElementById("content").appendChild(element);

const myCache = createEmotionCache({
  key: "mantine",
  container: emotionRoot,
});

// get nextcloud theme
/*const nextcloudTheme =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";*/

var nextcloudTheme = "dark";
const bodyElement = document.getElementsByTagName("body")[0];

if (
  bodyElement.getAttribute("data-themes").includes("light") ||
  bodyElement.classList.contains("theme--light")
) {
  nextcloudTheme = "light";
}

function App() {
  return (
    <>
      <MantineProvider
        theme={{
          colorScheme: nextcloudTheme,
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
            <OtpLayout>
              <AppShell />
            </OtpLayout>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}

createRoot(element.shadowRoot).render(<App />);
