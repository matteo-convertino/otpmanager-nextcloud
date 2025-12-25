import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import {type AccountRequestDTO, accountRequestSchema} from "@/dto/request/AccountRequestDTO.ts";
import {AccountType} from "@/utils/accountType.ts";
import {AccountPeriod} from "@/utils/accountPeriod.ts";
import {AccountAlgorithm} from "@/utils/accountAlgorithm.ts";
import {AccountDigits} from "@/utils/accountDigits.ts";
import AccountService from "@/services/AccountService.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";

export default function useCreateOtpAccountForm() {
    const otpManagerApi = useOtpManagerApi();
    const {setShowCreateAccount} = useModalsStore();
    const {setAccounts, setIsFetching} = useAccountsStore()

    const form = useForm<AccountRequestDTO>({
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

    function onSubmit(accountRequestDTO: AccountRequestDTO) {
        otpManagerApi({
            api: () => AccountService.getInstance().create(accountRequestDTO),
            titleOnSuccess: "Account created",
            messageOnSuccess: (accountRequestDTO.issuer != ""
                ? accountRequestDTO.issuer + " (" + accountRequestDTO.name + ")"
                : accountRequestDTO.name) + " created with success",
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

