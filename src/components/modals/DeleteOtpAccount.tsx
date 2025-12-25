import {Text} from "@mantine/core";
import {openConfirmModal} from "@mantine/modals";
import type {AccountResponseDatatable} from "@/dto/utils/AccountResponseDatatable.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import AccountService from "@/services/AccountService.ts";
import SharedAccountService from "@/services/SharedAccountService.ts";

export function openDeleteModal({account, setAccounts, setIsFetching, setPage}: {
    account: AccountResponseDatatable,
    setAccounts: (accounts?: AccountResponseDatatable[]) => void,
    setIsFetching: (isFetching: boolean) => void, setPage: (page: number) => void
}) {
    const otpManagerApi = useOtpManagerApi();

    async function deleteAccount() {
        otpManagerApi({
            api: () => account.unlocked === undefined ?
                AccountService.getInstance().delete(account.id) :
                SharedAccountService.getInstance().delete(account.id),
            titleOnLoading: "Deleting account",
            messageOnLoading: account.issuer + " (" + account.name + ") is being deleted",
            titleOnSuccess: "Account deleted",
            messageOnSuccess: (account.issuer != ""
                ? account.issuer + " (" + account.name + ")"
                : account.name) + " deleted with success",
            onComplete: () => {
                setPage(1);
                setAccounts(undefined);
                setIsFetching(true);
            }
        })
    }

    return openConfirmModal({
        title: "Delete Account",
        centered: true,
        children: (
            <Text size="sm">
                Are you sure that you want to remove{" "}
                {account.issuer != ""
                    ? account.issuer + " (" + account.name + ")"
                    : account.name}
                ?
            </Text>
        ),
        labels: {confirm: "Delete", cancel: "Cancel"},
        confirmProps: {color: "red"},
        //onCancel: () => console.log('Cancel'),
        onConfirm: () => deleteAccount(),
    });
}
