import {useEffect, useState} from "react";

import {Badge, Text} from "@mantine/core";
import {DataTable, type DataTableSortStatus} from "mantine-datatable";
import {useSettingsStore} from "@/context/useSettingsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import useUpdateCounter from "@/hooks/useUpdateCounter.tsx";
import {OtpType} from "@/utils/enum/otpType.ts";
import useSettingsForm from "@/hooks/settings/useSettingsForm.tsx";
import {AccountsEmpty} from "@/components/appShell/shared/AccountsEmpty.tsx";
import {AccountCode} from "@/components/appShell/shared/AccountCode.tsx";
import AccountActions from "@/components/appShell/shared/AccountActions.tsx";
import useAccountCode from "@/hooks/account/useAccountCode.ts";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";

export default function AccountsDatatable(
    {
        sortStatus,
        setSortStatus,
        isTrash = false,
    }: {
        sortStatus: DataTableSortStatus,
        setSortStatus: (sortStatus: DataTableSortStatus) => void,
        isTrash?: boolean,
    }) {
    const getRecordsPerPage = (p: number) => p === -1 && accounts !== undefined ? accounts.length : p;

    const {accounts, isFetching, getTotpRemainingSeconds} = useAccountsStore();
    const {recordsPerPage, setRecordsPerPage, pageOptions} = useSettingsStore();
    const {setShowSharedAccountToUnlock} = useModalsStore();
    const {setShowAsideInfo} = useSidebarStore();

    const [page, setPage] = useState(1);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(getRecordsPerPage(recordsPerPage));
    const [, setNow] = useState(Date.now());

    const {onUpdate: onUpdateCounter} = useUpdateCounter();
    const {onUpdate: onUpdateSettings} = useSettingsForm();

    const {canCopyCode} = useAccountCode();

    const canShowTTL = (account: AccountResponseDatatable) => !isTrash && account.type === OtpType.TOTP && canCopyCode(account);
    const emptyMessage = isTrash ? "Trash is empty" : "Add your first OTP account";

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

    useEffect(() => {
        if (!accounts?.some((account) => canShowTTL(account))) return;

        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [accounts]);

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
                if (isTrash) {
                    setShowAsideInfo(account);
                    return;
                }

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
                ...(!isTrash ? [
                    {
                        accessor: "code",
                        width: 100,
                        render: (account: AccountResponseDatatable) => <AccountCode account={account}/>
                    },
                    {
                        accessor: "ttl",
                        title: "TTL",
                        width: 48,
                        textAlignment: "center" as const,
                        render: (account: AccountResponseDatatable) => {
                            if (!canShowTTL(account)) return;

                            return (
                                <Badge variant="light" w={48}>
                                    {getTotpRemainingSeconds(account.period)}s
                                </Badge>
                            );
                        }
                    },
                ] : []),
                {
                    accessor: "actions",
                    width: 150,
                    title: <Text mr="xs">Actions</Text>,
                    textAlignment: "right",
                    render: (account) => (
                        <AccountActions account={account} groupProps={{position: "right"}} isTrash={isTrash}/>
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
            emptyState={<AccountsEmpty message={emptyMessage}/>}
        />
    );
}
