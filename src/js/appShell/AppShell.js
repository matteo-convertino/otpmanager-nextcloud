import React, { useState } from "react";

import { AppShell } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { NavbarLargeDevice } from "./../navbar/LargeDevice";
import { NavbarSmallDevice } from "./../navbar/SmallDevice";
import { AppShellContent } from "./Content";
import Aside from "./../aside/Aside";

export default function MainAppShell({ children }) {
  const smallScreen = useMediaQuery("(max-width: 991px)");

  const [otp, setOtp] = useState(null);
  const [showAside, setShowAside] = useState(false);
  const [showNavbarSmallDevice, setShowNavbarSmallDevice] = useState(false);
  const [showApps, setShowApps] = useState(false);

  // user settings
  const [showSettings, setShowSettings] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  return (
    <>
      <Aside showAside={showAside} setShowAside={setShowAside} otp={otp} />

      <NavbarSmallDevice
        showNavbarSmallDevice={showNavbarSmallDevice}
        setShowNavbarSmallDevice={setShowNavbarSmallDevice}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        showCodes={showCodes}
        setShowCodes={setShowCodes}
        setShowApps={setShowApps}
      />

      <AppShell
        padding="0"
        fixed={false}
        layout="alt"
        navbar={
          <NavbarLargeDevice
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            showCodes={showCodes}
            setShowCodes={setShowCodes}
            setShowApps={setShowApps}
          />
        }
        styles={{
          main: {
            width: smallScreen ? "100vw" : "calc(100vw - 300px)",
          },
        }}
      >
        <AppShellContent
          otp={otp}
          setOtp={setOtp}
          showNavbarSmallDevice={showNavbarSmallDevice}
          setShowNavbarSmallDevice={setShowNavbarSmallDevice}
          setShowAside={setShowAside}
          showCodes={showCodes}
          showApps={showApps}
          setShowApps={setShowApps}
        />
        {children}
      </AppShell>
    </>
  );
}
