import React from "react";
import { createRoot } from "react-dom/client";

import { createEmotionCache } from "@mantine/core";
import { OtpLayout } from "./js/OtpLayout";
import AppShell from "./js/appShell/AppShell";

import { UserSettingContextProvider } from "./js/utils/UserSettingProvider";

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

function App() {
 
  return (
    <>
     <UserSettingContextProvider>
        <OtpLayout myCache={myCache} emotionRoot={emotionRoot}>
          <AppShell />
        </OtpLayout>
      </UserSettingContextProvider>
    </>
  );
}

createRoot(element.shadowRoot).render(<App />);
