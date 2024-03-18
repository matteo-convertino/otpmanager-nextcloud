import React, { useState } from "react";

import {
  Header,
  Burger,
  Flex,
  Text,
  Anchor,
  Breadcrumbs,
  ActionIcon,
  Group,
  Button,
} from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";

import { AccountsTable } from "./accountsTable/AccountsTable";
import { CreateOtpAccount } from "../modals/CreateOtpAccount";
import { EditOtpAccount } from "../modals/EditOtpAccount";
import { ChangePassword } from "../modals/ChangePassword";
import { ImportExport } from "../modals/ImportExport";
import { UnlockSharedAccount } from "../modals/UnlockSharedAccount";

import { Apps } from "../modals/Apps";

export function AppShellContent({
  otp,
  setOtp,
  showNavbarSmallDevice,
  setShowNavbarSmallDevice,
  setShowAsideInfo,
  setShowAsideShare,
  showApps,
  setShowApps,
  setShowChangePassword,
  showChangePassword,
  showImportExport,
  setShowImportExport,
}) {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showEditOtpAccount, setShowEditOtpAccount] = useState(false);
  const [sharedAccountToUnlock, setSharedAccountToUnlock] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [isFetching, setFetchState] = useState(true);

  return (
    <>
      <Header height={44} mb={0}>
        <Flex align="center" h="100%">
          <Burger
            opened={showNavbarSmallDevice}
            onClick={() => setShowNavbarSmallDevice(true)}
            size="sm"
            ml={4}
            display={{ base: "block", md: "none" }}
          />

          <Breadcrumbs separator="→" ml="md">
            <Anchor href="#" variant="text" color="dimmed">
              <Text c="dimmed">All accounts</Text>
            </Anchor>

            <ActionIcon
              sx={{ display: "inline" }}
              variant="transparent"
              color="blue"
              onClick={() => setShowCreateAccount(true)}
            >
              <IconCirclePlus />
            </ActionIcon>
          </Breadcrumbs>
        </Flex>
      </Header>

      <Group
        sx={(theme) => ({
          background:
            theme.colorScheme === "dark"
              ? "rgba(0, 0, 0, .8)"
              : "rgba(255, 255, 255, .8)",
          padding: "16px",
          paddingBottom: "calc(var(--body-container-margin)*2 + 16px)",
          paddingRight: "calc(var(--body-container-margin)*2 + 16px)",
          height: "calc(100vh - 44px - 50px)",
        })}
        grow
      >
        <AccountsTable
          setOtp={setOtp}
          accounts={accounts}
          setAccounts={setAccounts}
          isFetching={isFetching}
          setFetchState={setFetchState}
          setShowEditOtpAccount={setShowEditOtpAccount}
          setShowAsideInfo={setShowAsideInfo}
          setShowAsideShare={setShowAsideShare}
          setSharedAccountToUnlock={setSharedAccountToUnlock}
        />
      </Group>

      <CreateOtpAccount
        showCreateAccount={showCreateAccount}
        setShowCreateAccount={setShowCreateAccount}
        setAccounts={setAccounts}
        setFetchState={setFetchState}
      />

      <EditOtpAccount
        otp={otp}
        showEditOtpAccount={showEditOtpAccount}
        setShowEditOtpAccount={setShowEditOtpAccount}
        setAccounts={setAccounts}
        setFetchState={setFetchState}
      />

      <ChangePassword
        showChangePassword={showChangePassword}
        setShowChangePassword={setShowChangePassword}
        setAccounts={setAccounts}
        setFetchState={setFetchState}
      />

      <ImportExport
        showImportExport={showImportExport}
        setShowImportExport={setShowImportExport}
        accounts={accounts}
        setAccounts={setAccounts}
        setFetchState={setFetchState}
      />

      <UnlockSharedAccount
        sharedAccountToUnlock={sharedAccountToUnlock}
        setSharedAccountToUnlock={setSharedAccountToUnlock}
        setAccounts={setAccounts}
        setFetchState={setFetchState}
      />

      <Apps showApps={showApps} setShowApps={setShowApps} />
    </>
  );
}
