import React, { useState, useEffect, useContext } from "react";

import { Text, ActionIcon, Group, Box, Stack, Avatar } from "@mantine/core";
import {
  IconTrash,
  IconEdit,
  IconReload,
  IconCopy,
  IconDatabaseOff,
  IconShare,
  IconLockOpen,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";

import { openDeleteModal } from "../../modals/DeleteOtpAccount";
import { copy } from "../../utils/copy";
import { updateCounter } from "../../utils/updateCounter";
import { UserSettingContext } from "./../../context/UserSettingProvider";
import { generateUrl } from "@nextcloud/router";

const PAGE_SIZES = ["10", "20", "30", "All"];

const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

export default function CustomDatatable({
  isFetching,
  setFetchState,
  accounts,
  setAccounts,
  setOtp,
  setShowAsideInfo,
  setShowAsideShare,
  setShowEditOtpAccount,
  sortStatus,
  setSortStatus,
  setSharedAccountToUnlock,
}) {
  const [userSetting, setUserSetting] = useContext(UserSettingContext);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [isUpdatingCounter, setUpdateCounterState] = useState(false);
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(pageSize);

  useEffect(() => {
    if (accounts == null) return;

    userSetting.recordsPerPage == "All"
      ? setPageSize(accounts.length)
      : setPageSize(userSetting.recordsPerPage);
  }, [userSetting.recordsPerPage, accounts]);

  useEffect(() => {
    if (accounts != null) {
      let from = (page - 1) * pageSize;

      setFrom(from);
      setTo(from + parseInt(pageSize));
    } else {
      setFrom(0);
      setTo(pageSize);
    }
  }, [page, pageSize]);

  return (
    <DataTable
      fetching={isFetching}
      textSelectionDisabled
      verticalSpacing="xs"
      records={accounts == null ? null : accounts.slice(from, to)}
      striped
      highlightOnHover
      withBorder
      sx={{ backgroundColor: "", marginTop: "0px" }}
      onRowClick={(otp, rowIndex, event) => {
        setOtp(otp);
        setShowAsideInfo(true);
      }}
      columns={[
        { accessor: "position", sortable: true, width: 70, title: "#" },
        { accessor: "name", sortable: true, width: 250 },
        { accessor: "issuer", sortable: true, width: 400 },
        {
          accessor: "code",
          width: 150,
          render: (account) => {
            return (
              <>
                <Box
                  sx={{
                    "&:hover>#hiddenCode": { display: "none" },
                    "&:hover>#code": { display: "flex" },
                  }}
                >
                  <Text
                    sx={{
                      display:
                        userSetting.showCodes ||
                        isTouchDevice ||
                        account.unlocked === 0
                          ? "none"
                          : "block",
                    }}
                    id="hiddenCode"
                  >
                    ******
                  </Text>
                  <Group
                    spacing={0}
                    id="code"
                    sx={{
                      display:
                        userSetting.showCodes ||
                        isTouchDevice ||
                        account.unlocked === 0
                          ? "flex"
                          : "none",
                    }}
                    onClick={(event) => {
                      if (
                        account.unlocked === undefined ||
                        account.unlocked === 1 ||
                        (account.type == "hotp" && account.counter > 0)
                      ) {
                        event.preventDefault();
                        event.stopPropagation();
                        copy(account.code);
                      }
                    }}
                  >
                    <Text>{account.code}</Text>
                    {(account.unlocked === undefined ||
                      account.unlocked === 1 ||
                      (account.type == "hotp" && account.counter > 0)) && (
                      <ActionIcon>
                        <IconCopy size={18} />
                      </ActionIcon>
                    )}
                  </Group>
                </Box>
              </>
            );
          },
        },
        {
          accessor: "actions",
          title: <Text mr="xs">Actions</Text>,
          textAlignment: "right",
          render: (account) => (
            <>
              <Group spacing={4} position="right" noWrap>
               

                {account.unlocked === 0 && (
                  <ActionIcon
                    //styles={{ color: "#114477" }}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSharedAccountToUnlock(account);
                      //unlockAccount(account, setUpdateCounterState);
                    }}
                  >
                    <IconLockOpen size={18} />
                  </ActionIcon>
                )}

                {account.type == "hotp" && account.unlocked !== 0 && (
                  <ActionIcon
                    //styles={{ color: "#114477" }}
                    disabled={isUpdatingCounter}
                    onClick={(event) => {
                      event.stopPropagation();
                      updateCounter(
                        account,
                        account.user_id,
                        setUpdateCounterState
                      );
                    }}
                  >
                    <IconReload size={18} />
                  </ActionIcon>
                )}

                {account.unlocked === 1 && (
                  <Avatar
                    src={generateUrl("/avatar/" + account.user_id + "/64")}
                    alt={account.user_id}
                    radius="xl"
                    size="sm"
                  />
                )}

                {account.unlocked === undefined && (
                  <ActionIcon
                    //color="gray"
                    onClick={(event) => {
                      event.stopPropagation();
                      setOtp(account);
                      setShowAsideShare(true);
                    }}
                  >
                    <IconShare size={18} />
                  </ActionIcon>
                )}

                <ActionIcon
                  color="blue"
                  onClick={(event) => {
                    event.stopPropagation();
                    setOtp(account);
                    setShowEditOtpAccount(true);
                  }}
                >
                  <IconEdit size={16} />
                </ActionIcon>

                <ActionIcon
                  color="red"
                  onClick={(event) => {
                    event.stopPropagation();
                    openDeleteModal(
                      account,
                      setAccounts,
                      setFetchState,
                      setPage
                    );
                  }}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            </>
          ),
        },
      ]}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      totalRecords={accounts == null ? 0 : accounts.length}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={(p) => {
        setUserSetting(userSetting.copyWith({ recordsPerPage: p }));
        setPage(1);
        p == "All" ? setPageSize(accounts.length) : setPageSize(p);
      }}
      emptyState={
        <Stack align="center" spacing="xs">
          <IconDatabaseOff size={40} />

          <Text color="dimmed">Add your first OTP account</Text>
        </Stack>
      }

      //selectedRecords={selectedAccounts}
      //onSelectedRecordsChange={setSelectedAccounts}
      //onRowClick={(account, index) => setOtp(account) }
    />
  );
}
