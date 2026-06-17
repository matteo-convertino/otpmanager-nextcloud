import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import AccountService from "@/services/AccountService.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";

export default function useTrashOtpAccount() {
    const otpManagerApi = useOtpManagerApi();
    const {setAccounts, setIsFetching} = useAccountsStore();

    function refreshTrash() {
        setAccounts(undefined);
        setIsFetching(true);
    }

    function onRestore(account: AccountResponseDatatable) {
        otpManagerApi({
            api: () => AccountService.getInstance().restore(account.id),
            titleOnLoading: "Restoring account",
            messageOnLoading: account.issuer + " (" + account.name + ") is being restored",
            titleOnSuccess: "Account restored",
            messageOnSuccess: (account.issuer !== ""
                ? account.issuer + " (" + account.name + ")"
                : account.name) + " restored with success",
            onComplete: refreshTrash,
        });
    }

    function onDeletePermanently(account: AccountResponseDatatable) {
        otpManagerApi({
            api: () => AccountService.getInstance().destroy(account.id),
            titleOnLoading: "Deleting account permanently",
            messageOnLoading: account.issuer + " (" + account.name + ") is being deleted permanently",
            titleOnSuccess: "Account deleted permanently",
            messageOnSuccess: (account.issuer !== ""
                ? account.issuer + " (" + account.name + ")"
                : account.name) + " deleted permanently",
            onComplete: refreshTrash,
        });
    }

    return {onRestore, onDeletePermanently};
}
