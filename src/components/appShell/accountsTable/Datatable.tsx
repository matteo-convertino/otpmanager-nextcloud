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
import {generateUrl} from "@nextcloud/router";
import {useSettingsStore} from "@/context/useSettingsStore";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import useUpdateCounter from "@/hooks/useUpdateCounter.tsx";
import {OtpType} from "@/utils/enum/otpType.ts";
import useCopy from "@/hooks/useCopy.tsx";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";
import useSettingsForm from "@/hooks/useSettingsForm.tsx";

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

    function getCodeLabel(account: AccountResponseDatatable): string {
        if (account.code === undefined) return '';

        if (account.code !== null) return account.code;

        if (account.unlocked === false) return 'Click here to unlock your shared account';
        if (account.type === OtpType.HOTP) return 'Click here to generate HOTP code';

        return '';
    }

    const getRecordsPerPage = (p: number) => p === -1 && accounts !== undefined ? accounts.length : p;

    const {accounts, isFetching} = useAccountsStore();
    const {showCodes, recordsPerPage, setRecordsPerPage, pageOptions} = useSettingsStore();
    const {setShowSharedAccountToUnlock, setShowEditOtpAccount, setShowDeleteOtpAccount} = useModalsStore();
    const {setShowAsideInfo, setShowAsideShare} = useSidebarStore();

    const {copy} = useCopy();
    const [page, setPage] = useState(1);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(getRecordsPerPage(recordsPerPage));

    const {isUpdating: isUpdatingCounter, onUpdate: onUpdateCounter} = useUpdateCounter();
    const {onUpdate: onUpdateSettings} = useSettingsForm();

    useEffect(() => {
        if (accounts === undefined) {
            setPage(1);
            return;
        }

        let p = getRecordsPerPage(recordsPerPage);
        let from = (page - 1) * p;

        setFrom(from);
        setTo(from + p);
    }, [accounts, page, recordsPerPage]);


    return (
        <DataTable
            fetching={isFetching}
            textSelectionDisabled
            verticalSpacing="xs"
            records={accounts?.slice(from, to)}
            striped
            highlightOnHover
            withBorder
            borderRadius="md"
            onRowClick={(account) => {
                if (account.unlocked === false) {
                    setShowSharedAccountToUnlock(account);
                } else if (account.type === OtpType.HOTP && account.counter !== null && account.counter < 0) {
                    onUpdateCounter(account);
                } else {
                    setShowAsideInfo(account);
                }
            }}
            columns={[
                {accessor: "name", sortable: true, width: 180, ellipsis: true},
                {accessor: "issuer", sortable: true, width: 150, ellipsis: true},
                {
                    accessor: "code",
                    width: 100,
                    render: (account) => {
                        let canCopyCode = account.code !== undefined && account.code !== null;
                        let shouldShowCode = showCodes || isTouchDevice || account.unlocked === false;

                        return (
                            <>
                                <Box
                                    sx={{
                                        "&:hover>.hiddenCode": {display: "none"},
                                        "&:hover>.code": {display: "flex"},
                                    }}
                                >
                                    <Text
                                        className="hiddenCode"
                                        sx={{
                                            display: shouldShowCode ? "none" : "block",
                                        }}
                                    >
                                        {"*".repeat(account.digits)}
                                    </Text>
                                    <Group
                                        className="code"
                                        spacing={0}
                                        sx={{
                                            display: shouldShowCode ? "flex" : "none",
                                        }}
                                        onClick={(event) => {
                                            if (account.code !== undefined && account.code !== null) {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                copy(account.code);
                                            }
                                        }}
                                    >
                                        <Text>{getCodeLabel(account)}</Text>
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
                    width: 150,
                    title: <Text mr="xs">Actions</Text>,
                    textAlignment: "right",
                    render: (account) => (
                        <>
                            <Group spacing={4} position="right" noWrap>
                                {account.unlocked === false && (
                                    <ActionIcon
                                        onClick={(event: MouseEvent) => {
                                            event.stopPropagation();
                                            setShowSharedAccountToUnlock(account);
                                        }}
                                    >
                                        <IconLockOpen size={18}/>
                                    </ActionIcon>
                                )}

                                {account.type === OtpType.HOTP &&
                                    account.unlocked !== false && (
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

                                {account.unlocked === true && (
                                    <Avatar
                                        src={generateUrl("/avatar/" + account.userId + "/64")}
                                        alt={account.userId}
                                        radius="xl"
                                        size="sm"
                                    />
                                )}

                                {!account.isShared && (
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
            totalRecords={accounts?.length}
            recordsPerPage={getRecordsPerPage(recordsPerPage)}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={pageOptions}
            onRecordsPerPageChange={(p) => {
                p = p === accounts?.length ? -1 : p;

                setRecordsPerPage(p);
                setPage(1);
                onUpdateSettings({recordsPerPage: p.toString()});
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
