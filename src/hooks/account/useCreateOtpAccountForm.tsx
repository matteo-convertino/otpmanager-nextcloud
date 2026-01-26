import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import {accountRequestSchema, type AccountRequestSchemaForm} from "@/dto/request/AccountRequestDTO.ts";
import {OtpType} from "@/utils/enum/otpType.ts";
import {OtpPeriod} from "@/utils/enum/otpPeriod.ts";
import {OtpAlgorithm} from "@/utils/enum/otpAlgorithm.ts";
import {OtpDigits} from "@/utils/enum/otpDigits.ts";
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
            type: OtpType.TOTP,
            period: OtpPeriod.P30,
            algorithm: OtpAlgorithm.SHA1,
            digits: OtpDigits.D6,
        },
    });

    function onSubmit(accountRequestSchemaForm: AccountRequestSchemaForm) {
        otpManagerApi({
            api: () => AccountService.getInstance().create({
                ...accountRequestSchemaForm,
                secret: encrypt(accountRequestSchemaForm.secret),
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

