import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import {accountRequestSchema, type AccountRequestSchemaForm} from "@/dto/request/AccountRequestDTO.ts";
import {AccountType} from "@/utils/accountType.ts";
import {AccountPeriod} from "@/utils/accountPeriod.ts";
import {AccountAlgorithm} from "@/utils/accountAlgorithm.ts";
import {AccountDigits} from "@/utils/accountDigits.ts";
import AccountService from "@/services/AccountService.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import useEncryption from "@/hooks/useEncryption.tsx";

export default function useCreateOtpAccountForm() {
    const otpManagerApi = useOtpManagerApi();
    const {setShowCreateAccount} = useModalsStore();
    const {setAccounts, setIsFetching} = useAccountsStore();
    const {encrypt} = useEncryption();

    const form = useForm<AccountRequestSchemaForm>({
        validate: zodResolver(accountRequestSchema),
        initialValues: {
            name: "",
            issuer: "",
            secret: "",
            type: AccountType.TOTP,
            period: AccountPeriod.P30,
            algorithm: AccountAlgorithm.SHA1,
            digits: AccountDigits.D6,
        },
    });

    function onSubmit(accountRequestSchemaForm: AccountRequestSchemaForm) {
        otpManagerApi({
            api: () => AccountService.getInstance().create({
                ...accountRequestSchemaForm,
                secret: encrypt(accountRequestSchemaForm.secret),
                period: parseInt(accountRequestSchemaForm.period),
                digits: parseInt(accountRequestSchemaForm.digits)
            }),
            titleOnSuccess: "Account created",
            messageOnSuccess: (accountRequestSchemaForm.issuer != ""
                ? accountRequestSchemaForm.issuer + " (" + accountRequestSchemaForm.name + ")"
                : accountRequestSchemaForm.name) + " created with success",
            titleOnLoading: "Creating account",
            messageOnLoading: "Account is being creating",
            onComplete: (_) => {
                setShowCreateAccount(false);
                form.reset();
                setAccounts(undefined);
                setIsFetching(true);
            },
            messageOnGenericError: "Something went wrong while creating the account",
        });
    }

    return {form, onSubmit};
}

