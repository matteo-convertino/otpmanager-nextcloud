import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import SharedAccountService from "@/services/SharedAccountService.ts";
import {sharedAccountUnlockSchema} from "@/dto/request/SharedAccountUnlockDTO.ts";
import {useSecretStore} from "@/context/useSecretStore.ts";
import {z} from 'zod'

export default function useUnlockSharedAccountForm() {
    const otpManagerApi = useOtpManagerApi();
    const {showSharedAccountToUnlock, setShowSharedAccountToUnlock} = useModalsStore();
    const {setAccounts, setIsFetching} = useAccountsStore();
    const {passwordHash} = useSecretStore();

    const form = useForm({
        initialValues: {tempPassword: ""},
        validate: zodResolver(sharedAccountUnlockSchema),
    });

    function onSubmit(values: z.infer<typeof sharedAccountUnlockSchema>) {
        if (showSharedAccountToUnlock === undefined) return;

        otpManagerApi({
            api: () => SharedAccountService.getInstance().unlock({
                tempPassword: values.tempPassword,
                accountId: showSharedAccountToUnlock.id,
                currentPassword: passwordHash,
            }),
            titleOnLoading: "Shared Account",
            messageOnLoading: "Unlocking shared account",
            titleOnSuccess: "Shared Account",
            messageOnSuccess: "Shared account unlocked with success",
            onComplete: () => {
                setShowSharedAccountToUnlock(undefined);
                setAccounts(undefined);
                setIsFetching(true);
            }
        });
    }

    return {form, onSubmit};
}

