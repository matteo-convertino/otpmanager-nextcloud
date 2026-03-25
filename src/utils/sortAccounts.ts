import sortBy from "lodash/sortBy";
import type {DataTableSortStatus} from "mantine-datatable";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";

export function sortAccounts(
    accounts: AccountResponseDatatable[],
    sortStatus: DataTableSortStatus,
): AccountResponseDatatable[] {
    const sortedAccounts = sortBy(accounts, (account) => {
        const value = account[sortStatus.columnAccessor as keyof AccountResponseDatatable];
        return typeof value === "string" ? value.toLowerCase() : value;
    });

    return sortStatus.direction === "desc" ? sortedAccounts.reverse() : sortedAccounts;
}
