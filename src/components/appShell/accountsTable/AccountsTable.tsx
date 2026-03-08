import {useEffect, useState} from "react";
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
    const [timer, setTimer] = useState<number | undefined>(undefined);
    const {accounts, setAccounts, isFetching, setIsFetching} = useAccountsStore();
    const otpManagerApi = useOtpManagerApi();
    const {generateCodes} = useAccountsCodeGeneration();
    const {setPageOptions} = useSettingsStore();

    const sortValue = (account: AccountResponseDatatable) => {
        const value = account[sortStatus.columnAccessor as keyof AccountResponseDatatable];
        return typeof value === "string" ? value.toLowerCase() : value;
    };

    useEffect(() => {
        if (!isFetching) return;

        setIsFetching(true);

        otpManagerApi({
            api: AccountService.getInstance().getAll,
            showNotifications: false,
            onComplete: (accountsResponseDatatable) => {
                accountsResponseDatatable = sortBy(accountsResponseDatatable, sortValue);

                if (timer !== undefined) clearTimeout(timer);

                generateCodes({accounts: accountsResponseDatatable, setTimer: setTimer});

                setPageOptions([
                    ...PAGE_SIZES.filter((n) => n < accountsResponseDatatable.length),
                    accountsResponseDatatable.length
                ]);
                setIsFetching(false);
            }
        });
    }, [isFetching]);

    useEffect(() => {
        if (accounts === undefined) return;

        let response = sortBy(accounts, sortValue);
        if (sortStatus.direction === "desc") response = response.reverse();

        setAccounts(response);
    }, [sortStatus]);

    return (
        <Datatable
            sortStatus={sortStatus}
            setSortStatus={setSortStatus}
        />
    );
}
