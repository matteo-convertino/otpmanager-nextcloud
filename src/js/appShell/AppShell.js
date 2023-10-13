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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  /*const [showExportAccounts, setShowExportAccounts] = useState(false);
  const [showImportAccounts, setShowImportAccounts] = useState(false);*/

  // user settings
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <Aside showAside={showAside} setShowAside={setShowAside} otp={otp} />

      <NavbarSmallDevice
        showNavbarSmallDevice={showNavbarSmallDevice}
        setShowNavbarSmallDevice={setShowNavbarSmallDevice}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        setShowApps={setShowApps}
        setShowChangePassword={setShowChangePassword}
        /*setShowExportAccounts={setShowExportAccounts}
        setShowImportAccounts={setShowImportAccounts}*/
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
            /*setShowExportAccounts={setShowExportAccounts}
            setShowImportAccounts={setShowImportAccounts}*/
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
          setShowAside={setShowAside}
          showApps={showApps}
          setShowApps={setShowApps}
          setShowChangePassword={setShowChangePassword}
          showChangePassword={showChangePassword}
          /*showExportAccounts={showExportAccounts}
          setShowExportAccounts={setShowExportAccounts}
          showImportAccounts={showImportAccounts}
          setShowImportAccounts={setShowImportAccounts}*/
          showImportExport={showImportExport}
          setShowImportExport={setShowImportExport}
        />
        {children}
      </AppShell>
    </>
  );
}
