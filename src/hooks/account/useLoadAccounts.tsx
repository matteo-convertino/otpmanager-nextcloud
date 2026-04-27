import {useEffect} from "react";
import type {DataTableSortStatus} from "mantine-datatable";
import {PAGE_SIZES, useSettingsStore} from "@/context/useSettingsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import useAccountsCodeGeneration from "@/hooks/account/useAccountsCodeGeneration.tsx";
import AccountService from "@/services/AccountService.ts";
import {sortAccounts} from "@/utils/sortAccounts.ts";

const defaultSortStatus: DataTableSortStatus = {
    columnAccessor: "position",
    direction: "asc",
};

export default function useLoadAccounts() {
    const {setPageOptions} = useSettingsStore();
    const {isFetching: isFetchingAccounts, setAccounts, setIsFetching: setIsFetchingAccounts} = useAccountsStore();
    const otpManagerApi = useOtpManagerApi();
    const {generateCodes} = useAccountsCodeGeneration();

    useEffect(() => {
        if (!isFetchingAccounts) return;

        otpManagerApi({
            api: AccountService.getInstance().getAll,
            showNotifications: false,
            onComplete: (accountsResponseDatatable) => {
                const sortedAccounts = sortAccounts(accountsResponseDatatable, defaultSortStatus);

                setAccounts(sortedAccounts);
                generateCodes({
                    accounts: sortedAccounts,
                });
                setPageOptions([
                    ...PAGE_SIZES.filter((n) => n < sortedAccounts.length),
                    sortedAccounts.length
                ]);
                setIsFetchingAccounts(false);
            }
        });
    }, [generateCodes, isFetchingAccounts, otpManagerApi, setAccounts, setIsFetchingAccounts, setPageOptions]);
}
