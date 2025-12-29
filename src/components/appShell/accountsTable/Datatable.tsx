import {useEffect, useState} from "react";

import {ActionIcon, Avatar, Box, Group, Stack, Text} from "@mantine/core";
import {
    IconCopy,
    IconDatabaseOff,
    IconEdit,
    IconLockOpen,
    IconReload,
    IconShare,
    IconTrash,
} from "@tabler/icons-react";
import {DataTable, type DataTableSortStatus} from "mantine-datatable";
import {copy} from "@/utils/copy";
import {updateCounter} from "@/utils/updateCounter";
import {generateUrl} from "@nextcloud/router";
import {PAGE_SIZES, useSettingsStore} from "@/context/useSettingsStore";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useSidebarStore} from "@/context/useSidebarStore.ts";


const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

export default function CustomDatatable(
    {
        sortStatus,
        setSortStatus,
    }: {
        sortStatus: DataTableSortStatus,
        setSortStatus: (sortStatus: DataTableSortStatus) => void
    }) {
    const {showCodes, recordsPerPage, setRecordsPerPage} = useSettingsStore();
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [isUpdatingCounter, setUpdateCounterState] = useState(false);
    const [page, setPage] = useState(1);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(pageSize);

    const {accounts, isFetching} = useAccountsStore();
    const {setShowSharedAccountToUnlock, setShowEditOtpAccount, setShowDeleteOtpAccount} = useModalsStore();
    const {setShowAsideInfo, setShowAsideShare} = useSidebarStore();


    useEffect(() => {
        if (accounts === undefined) return;

        setPageSize(accounts.length);
        // recordsPerPage == "All"
        //   ? setPageSize(accounts.length)
        //   : setPageSize(recordsPerPage);
    }, [recordsPerPage, accounts]);

    useEffect(() => {
        if (accounts === undefined) {
            setFrom(0);
            setTo(pageSize);
        } else {
            let from = (page - 1) * pageSize;

            setFrom(from);
            setTo(from + pageSize);
        }
    }, [page, pageSize]);

    return (
        <DataTable
            fetching={isFetching}
            textSelectionDisabled
            verticalSpacing="xs"
            records={accounts === undefined ? undefined : accounts.slice(from, to)}
            striped
            highlightOnHover
            withBorder
            sx={{backgroundColor: "", marginTop: "0px"}}
            onRowClick={(account) => {
                if (account.unlocked === 0) {
                    setShowSharedAccountToUnlock(account);
                } else if (account.type == "hotp" && account.counter < 0) {
                    updateCounter(account, account.user_id, setUpdateCounterState);
                } else {
                    setShowAsideInfo(account);
                }
            }}
            columns={[
                {accessor: "position", sortable: true, width: 70, title: "#"},
                {accessor: "name", sortable: true, width: 250},
                {accessor: "issuer", sortable: true, width: 400},
                {
                    accessor: "code",
                    width: 300,
                    render: (account) => {
                        return (
                            <>
                                <Box
                                    sx={{
                                        "&:hover>#hiddenCode": {display: "none"},
                                        "&:hover>#code": {display: "flex"},
                                    }}
                                >
                                    <Text
                                        sx={{
                                            display:
                                                showCodes ||
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
                                                showCodes ||
                                                isTouchDevice ||
                                                account.unlocked === 0
                                                    ? "flex"
                                                    : "none",
                                        }}
                                        onClick={(event) => {
                                            if (
                                                (account.unlocked === undefined ||
                                                    account.unlocked === 1) &&
                                                ((account.type == "hotp" && account.counter >= 0) ||
                                                    account.type == "totp")
                                            ) {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                copy(account.code);
                                            }
                                        }}
                                    >
                                        <Text>{account.code}</Text>
                                        {(account.unlocked === undefined ||
                                                account.unlocked === 1) &&
                                            ((account.type == "hotp" && account.counter >= 0) ||
                                                account.type == "totp") && (
                                                <ActionIcon>
                                                    <IconCopy size={18}/>
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
                                {(account.unlocked === 0) && (
                                    <ActionIcon
                                        onClick={(event: MouseEvent) => {
                                            event.stopPropagation();
                                            setShowSharedAccountToUnlock(account);
                                        }}
                                    >
                                        <IconLockOpen size={18}/>
                                    </ActionIcon>
                                )}

                                {account.type == "hotp" &&
                                    account.unlocked !== 0 && (
                                        <ActionIcon
                                            disabled={isUpdatingCounter}
                                            onClick={(event: MouseEvent) => {
                                                event.stopPropagation();
                                                updateCounter(
                                                    account,
                                                    account.user_id,
                                                    setUpdateCounterState
                                                );
                                            }}
                                        >
                                            <IconReload size={18}/>
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
                                        onClick={(event: MouseEvent) => {
                                            event.stopPropagation();
                                            setShowAsideShare(account);
                                        }}
                                    >
                                        <IconShare size={18}/>
                                    </ActionIcon>
                                )}

                                <ActionIcon
                                    color="blue"
                                    onClick={(event: MouseEvent) => {
                                        event.stopPropagation();
                                        setShowEditOtpAccount(account);
                                    }}
                                >
                                    <IconEdit size={16}/>
                                </ActionIcon>

                                <ActionIcon
                                    color="red"
                                    onClick={(event: MouseEvent) => {
                                        event.stopPropagation();
                                        setShowDeleteOtpAccount(account);
                                        /*openDeleteModal({
                                            account: account,
                                            setAccounts: setAccounts,
                                            setIsFetching: setIsFetching,
                                            setPage: setPage,
                                        });*/
                                    }}
                                >
                                    <IconTrash size={18}/>
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
                setRecordsPerPage(p)
                setPage(1);
                setPageSize(p);
                // p == "All" ? setPageSize(accounts.length) : setPageSize(p);
            }}
            emptyState={
                <Stack align="center" spacing="xs">
                    <IconDatabaseOff size={40}/>

                    <Text color="dimmed">Add your first OTP account</Text>
                </Stack>
            }
        />
    );
}
