import { createRoot } from "react-dom/client";

import { OtpLayout } from "@/components/OtpLayout";
import AppShell from "@/components/appShell/AppShell";

// import { UserSettingContextProvider } from "./js/context/UserSettingProvider";
// import { SecretContextProvider } from "./js/context/SecretProvider";
import createCache from "@emotion/cache";


// generate OTP Manager's (shadow) DOM structure
const otpManagerContainer = document.createElement('main');
const shadowRoot = otpManagerContainer.attachShadow({mode: 'open'});

const otpManagerMantineRoot = document.createElement('div');
otpManagerMantineRoot.id = 'otpmanager-mantine-root';
shadowRoot.appendChild(otpManagerMantineRoot);

const otpManagerMantineApp = document.createElement('div');
otpManagerMantineApp.id = 'otpmanager-mantine-app';
otpManagerMantineRoot.appendChild(otpManagerMantineApp);

const otpManagerMantinePortal = document.createElement('div');
otpManagerMantinePortal.id = 'otpmanager-mantine-portal';
otpManagerMantineRoot.appendChild(otpManagerMantinePortal);

document.getElementById('content')!.appendChild(otpManagerContainer);

const myCache = createCache({
  key: "mantine",
  container: otpManagerMantineRoot,
});

function App() {
  return (
    <>
      {/*<UserSettingContextProvider>*/}
      {/*  <SecretContextProvider>*/}
          <OtpLayout myCache={myCache} emotionRoot={otpManagerMantinePortal}>
            <AppShell />
          </OtpLayout>
        {/*</SecretContextProvider>*/}
      {/*</UserSettingContextProvider>*/}
    </>
  );
}

createRoot(otpManagerMantineApp).render(<App />);
