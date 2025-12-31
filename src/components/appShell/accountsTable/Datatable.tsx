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
import {generateUrl} from "@nextcloud/router";
import {useSettingsStore} from "@/context/useSettingsStore";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import useUpdateCounter from "@/hooks/useUpdateCounter.tsx";

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
    const {showCodes, recordsPerPage, setRecordsPerPage, pageOptions} = useSettingsStore();
    const [page, setPage] = useState(1);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(recordsPerPage);

    const {accounts, isFetching} = useAccountsStore();
    const {setShowSharedAccountToUnlock, setShowEditOtpAccount, setShowDeleteOtpAccount} = useModalsStore();
    const {setShowAsideInfo, setShowAsideShare} = useSidebarStore();

    const {isUpdating: isUpdatingCounter, onUpdate: onUpdateCounter} = useUpdateCounter();

    useEffect(() => {
        if (accounts === undefined) setPage(1);
    }, [accounts]);

    useEffect(() => {
        let from = (page - 1) * recordsPerPage;

        setFrom(from);
        setTo(from + recordsPerPage);
    }, [page, recordsPerPage]);

    return (
        <DataTable
            fetching={isFetching}
            textSelectionDisabled
            verticalSpacing="xs"
            records={accounts?.slice(from, to)}
            striped
            highlightOnHover
            withBorder
            // sx={{backgroundColor: "", marginTop: "0px"}}
            onRowClick={(account) => {
                if (account.unlocked === 0) {
                    setShowSharedAccountToUnlock(account);
                } else if (account.type == "hotp" && account.counter < 0) {
                    onUpdateCounter(account);
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
                        let canCopyCode = (account.unlocked === undefined || account.unlocked === 1) &&
                            ((account.type == "hotp" && account.counter >= 0) || account.type == "totp");

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
                                        {"*".repeat(account.digits)}
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
                                            if (canCopyCode) {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                copy(account.code);
                                            }
                                        }}
                                    >
                                        <Text>{account.code}</Text>
                                        {canCopyCode && (
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
                                {account.unlocked === 0 && (
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
                                                onUpdateCounter(account);
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
            recordsPerPage={recordsPerPage}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={pageOptions}
            onRecordsPerPageChange={(p) => {
                setRecordsPerPage(p)
                setPage(1);
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
