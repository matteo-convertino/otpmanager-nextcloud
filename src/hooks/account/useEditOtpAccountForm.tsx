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
import {useEffect} from "react";
import SharedAccountService from "@/services/SharedAccountService.ts";

export default function useEditOtpAccountForm() {
    const otpManagerApi = useOtpManagerApi();
    const {showEditOtpAccount: otp, setShowEditOtpAccount} = useModalsStore();
    const {setAccounts, setIsFetching} = useAccountsStore();

    useEffect(() => {
        if (otp != undefined) {
            form.setValues({
                name: otp.name,
                issuer: otp.issuer,
                secret: otp.decryptedSecret!,
                type: otp.type,
                period: otp.period,
                algorithm: otp.algorithm,
                digits: otp.digits,
            })
        }
    }, [otp]);

    const form = useForm<AccountRequestSchemaForm>({
        initialValues: {
            name: "",
            issuer: "",
            secret: "",
            type: OtpType.TOTP,
            period: OtpPeriod.P30,
            algorithm: OtpAlgorithm.SHA1,
            digits: OtpDigits.D6,
        },
        validate: zodResolver(accountRequestSchema),
    });

    function onSubmit(accountRequestSchemaForm: AccountRequestSchemaForm) {
        if (otp == undefined) return;

        const data = {
            ...accountRequestSchemaForm,
            secret: otp.secret,
        };

        otpManagerApi<any>({
            api: () => otp.isShared
                ? SharedAccountService.getInstance().update(data)
                : AccountService.getInstance().update(data),
            titleOnLoading: "Editing account",
            messageOnLoading:
                "Account is being editing",
            titleOnSuccess:
                "Account edited",
            messageOnSuccess:
                (accountRequestSchemaForm.issuer != ""
                    ? accountRequestSchemaForm.issuer + " (" + accountRequestSchemaForm.name + ")"
                    : accountRequestSchemaForm.name) + " edited with success",
            onComplete: () => {
                setShowEditOtpAccount(undefined);
                setAccounts(undefined);
                setIsFetching(true);
            }
        });
    }

    return {form, onSubmit};
}

