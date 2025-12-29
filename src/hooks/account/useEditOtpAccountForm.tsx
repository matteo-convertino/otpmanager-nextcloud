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
import {convertValueIndexToEnum, convertValueToEnum} from "@/utils/convertToEnum.ts";
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
                type: convertValueToEnum(AccountType, otp.type),
                period: convertValueToEnum(AccountPeriod, otp.period.toString()),
                algorithm: convertValueIndexToEnum(AccountAlgorithm, otp.algorithm),
                digits: convertValueToEnum(AccountDigits, otp.digits.toString()),
            })
        }
    }, [otp]);

    const form = useForm<AccountRequestSchemaForm>({
        initialValues: {
            name: "",
            issuer: "",
            secret: "",
            type: AccountType.TOTP,
            period: AccountPeriod.P30,
            algorithm: AccountAlgorithm.SHA1,
            digits: AccountDigits.D6,
        },
        validate: zodResolver(accountRequestSchema),
    });

    function onSubmit(accountRequestSchemaForm: AccountRequestSchemaForm) {
        if (otp == undefined) return;

        otpManagerApi({
            api: () => otp.unlocked === undefined ?
                AccountService.getInstance().update({
                    ...accountRequestSchemaForm,
                    secret: otp.secret,
                    period: parseInt(accountRequestSchemaForm.period),
                    digits: parseInt(accountRequestSchemaForm.digits)
                }) :
                SharedAccountService.getInstance().update({
                    ...accountRequestSchemaForm,
                    secret: otp.secret,
                }),
            titleOnLoading: "Editing account",
            messageOnLoading: "Account is being editing",
            titleOnSuccess: "Account edited",
            messageOnSuccess: (accountRequestSchemaForm.issuer != ""
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

