import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import AccountService from "@/services/AccountService.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import SharedAccountService from "@/services/SharedAccountService.ts";

export default function useDeleteOtpAccount() {
    const otpManagerApi = useOtpManagerApi();
    const {showDeleteOtpAccount: otp, setShowDeleteOtpAccount} = useModalsStore();
    const {setAccounts, setIsFetching} = useAccountsStore();

    function onDelete() {
        if (otp == undefined) return;

        otpManagerApi<any>({
            api: () => otp.isShared ?
                SharedAccountService.getInstance().delete(otp.id, null) :
                AccountService.getInstance().delete(otp.id),
            titleOnLoading: "Deleting account",
            messageOnLoading: otp.issuer + " (" + otp.name + ") is being deleted",
            titleOnSuccess: "Account deleted",
            messageOnSuccess: (otp.issuer != ""
                ? otp.issuer + " (" + otp.name + ")"
                : otp.name) + " deleted with success",
            onComplete: () => {
                // setPage(1);
                setAccounts(undefined);
                setIsFetching(true);
                setShowDeleteOtpAccount(undefined);
            }
        })
    }

    return {onDelete};
}

