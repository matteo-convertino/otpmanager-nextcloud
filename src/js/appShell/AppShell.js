import React, { useState } from "react";

import { AppShell } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { NavbarLargeDevice } from "./../navbar/LargeDevice";
import { NavbarSmallDevice } from "./../navbar/SmallDevice";
import { AppShellContent } from "./Content";

import Aside from "./../aside/Aside";
import AsideInfo from "./../aside/Info";
import AsideShare from "./../aside/Share";

export default function MainAppShell({ children }) {
  const smallScreen = useMediaQuery("(max-width: 991px)");

  const [otp, setOtp] = useState(null);
  const [showAsideInfo, setShowAsideInfo] = useState(false);
  const [showAsideShare, setShowAsideShare] = useState(false);
  const [showNavbarSmallDevice, setShowNavbarSmallDevice] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  // user settings
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <Aside showAside={showAsideInfo} setShowAside={setShowAsideInfo} otp={otp} title="Account Details">
        <AsideInfo otp={otp} />
      </Aside>

      <Aside showAside={showAsideShare} setShowAside={setShowAsideShare} otp={otp} title="Account Sharing">
        <AsideShare otp={otp} />
      </Aside>

      <NavbarSmallDevice
        showNavbarSmallDevice={showNavbarSmallDevice}
        setShowNavbarSmallDevice={setShowNavbarSmallDevice}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        setShowApps={setShowApps}
        setShowChangePassword={setShowChangePassword}
        setShowImportExport={setShowImportExport}
      />

      <AppShell
        padding="0"
        fixed={false}
        layout="alt"
        navbar={
          <NavbarLargeDevice
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            setShowChangePassword={setShowChangePassword}
            setShowApps={setShowApps}
            setShowImportExport={setShowImportExport}
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
          setShowAsideInfo={setShowAsideInfo}
          setShowAsideShare={setShowAsideShare}
          showApps={showApps}
          setShowApps={setShowApps}
          setShowChangePassword={setShowChangePassword}
          showChangePassword={showChangePassword}
          showImportExport={showImportExport}
          setShowImportExport={setShowImportExport}
        />
        {children}
      </AppShell>
    </>
  );
}
