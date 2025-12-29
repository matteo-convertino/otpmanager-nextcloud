import {useEffect, useState} from "react";
import sortBy from "lodash/sortBy";

import Datatable from "./Datatable";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import AccountService from "@/services/AccountService.ts";
import type {AccountResponseDatatable} from "@/dto/utils/AccountResponseDatatable.ts";
import type {DataTableSortStatus} from "mantine-datatable";
import useAccountsCodeGeneration from "@/hooks/account/useAccountsCodeGeneration.tsx";

export function AccountsTable() {
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: "position",
        direction: "asc",
    });
    const [timer, setTimer] = useState<number | undefined>(undefined);
    const {accounts, setAccounts, isFetching, setIsFetching} = useAccountsStore();
    const otpManagerApi = useOtpManagerApi();
    const {generateCodes} = useAccountsCodeGeneration();

    useEffect(() => {
        if (isFetching) {
            setIsFetching(true);

            otpManagerApi({
                api: AccountService.getInstance().getAll,
                showNotifications: false,
                onComplete: (allAccounts) => {
                    let accountsResponseDatatable: AccountResponseDatatable[] = [];

                    accountsResponseDatatable.push(...allAccounts.accounts);

                    accountsResponseDatatable.push(...allAccounts.shared_accounts.map(
                        ({account_id, ...rest}) => ({
                            ...rest,
                            id: account_id,
                        })
                    ));

                    accountsResponseDatatable = sortBy(accountsResponseDatatable, sortStatus.columnAccessor);

                    if (timer !== undefined) {
                        clearTimeout(timer);
                    }

                    generateCodes({accounts: accountsResponseDatatable, setTimer: setTimer});
                    setIsFetching(false);
                }
            });
        } else if (accounts !== undefined) {
            let response = sortBy(accounts, sortStatus.columnAccessor);
            if (sortStatus.direction === "desc") response = response.reverse();
            setAccounts(response);
        }
    }, [sortStatus, isFetching]);

    return (
        <Datatable
            sortStatus={sortStatus}
            setSortStatus={setSortStatus}
        />
    );
}
