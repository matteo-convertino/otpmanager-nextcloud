import {useEffect} from "react";
import type {DataTableSortStatus} from "mantine-datatable";
import {PAGE_SIZES, useSettingsStore} from "@/context/useSettingsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import useAccountsCodeGeneration from "@/hooks/account/useAccountsCodeGeneration.tsx";
import AccountService from "@/services/AccountService.ts";
import {sortAccounts} from "@/utils/sortAccounts.ts";
import {useNavbarPageStore} from "@/context/useNavbarPageStore.ts";
import {NavbarPage} from "@/utils/enum/navbarPage.ts";

const defaultSortStatus: DataTableSortStatus = {
    columnAccessor: "position",
    direction: "asc",
};

export default function useLoadAccounts() {
    const {setPageOptions} = useSettingsStore();
    const {isFetching: isFetchingAccounts, setAccounts, setIsFetching: setIsFetchingAccounts} = useAccountsStore();
    const {activePage} = useNavbarPageStore();
    const otpManagerApi = useOtpManagerApi();
    const {generateCodes} = useAccountsCodeGeneration();

    useEffect(() => {
        if (!isFetchingAccounts) return;

        otpManagerApi({
            api: activePage === NavbarPage.TRASH
                ? AccountService.getInstance().getAllDeleted
                : AccountService.getInstance().getAll,
            showNotifications: false,
            onComplete: (accountsResponseDatatable) => {
                const sortedAccounts = sortAccounts(accountsResponseDatatable, defaultSortStatus);

                setAccounts(sortedAccounts);
                if (activePage === NavbarPage.ALL) {
                    generateCodes({
                        accounts: sortedAccounts,
                    });
                }
                setPageOptions([
                    ...PAGE_SIZES.filter((n) => n < sortedAccounts.length),
                    sortedAccounts.length
                ]);
                setIsFetchingAccounts(false);
            }
        });
    }, [activePage, generateCodes, isFetchingAccounts, otpManagerApi, setAccounts, setIsFetchingAccounts, setPageOptions]);
}
