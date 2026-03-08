import {useCallback, useEffect, useRef, useState} from "react";
import sortBy from "lodash/sortBy";

import Datatable from "./Datatable";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import AccountService from "@/services/AccountService.ts";
import type {DataTableSortStatus} from "mantine-datatable";
import useAccountsCodeGeneration from "@/hooks/account/useAccountsCodeGeneration.tsx";
import {PAGE_SIZES, useSettingsStore} from "@/context/useSettingsStore.ts";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";

export function AccountsTable() {
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: "position",
        direction: "asc",
    });
    const sortStatusRef = useRef(sortStatus);
    const {accounts, setAccounts, isFetching, setIsFetching} = useAccountsStore();
    const otpManagerApi = useOtpManagerApi();
    const {generateCodes} = useAccountsCodeGeneration();
    const {setPageOptions} = useSettingsStore();

    const sortAccounts = useCallback((accounts: AccountResponseDatatable[]) => {
        const currentSortStatus = sortStatusRef.current;

        accounts = sortBy(accounts, (a) => {
            const value = a[currentSortStatus.columnAccessor as keyof AccountResponseDatatable];
            return typeof value === "string" ? value.toLowerCase() : value;
        });

        return currentSortStatus.direction === "desc" ? accounts.reverse() : accounts;
    }, []);

    useEffect(() => {
        if (!isFetching) return;

        setIsFetching(true);

        otpManagerApi({
            api: AccountService.getInstance().getAll,
            showNotifications: false,
            onComplete: (accountsResponseDatatable) => {
                accountsResponseDatatable = sortAccounts(accountsResponseDatatable);
                setAccounts(accountsResponseDatatable);

                generateCodes({accounts: accountsResponseDatatable, sortAccounts: sortAccounts});

                setPageOptions([
                    ...PAGE_SIZES.filter((n) => n < accountsResponseDatatable.length),
                    accountsResponseDatatable.length
                ]);
                setIsFetching(false);
            }
        });
    }, [isFetching]);

    useEffect(() => {
        sortStatusRef.current = sortStatus;
        if (accounts === undefined) return;

        setAccounts(sortAccounts(accounts));
    }, [sortStatus]);

    return (
        <Datatable
            sortStatus={sortStatus}
            setSortStatus={setSortStatus}
        />
    );
}
