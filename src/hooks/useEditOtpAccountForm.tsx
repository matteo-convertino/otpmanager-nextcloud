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
import {convertValueIndexToEnum, convertValueToEnum} from "@/utils/convertToEnum.ts";
import {useEffect} from "react";
import SharedAccountService from "@/services/SharedAccountService.ts";

export default function useEditOtpAccountForm() {
    const otpManagerApi = useOtpManagerApi();
    const {showEditOtpAccount: otp, setShowEditOtpAccount} = useModalsStore();
    const {setAccounts, setIsFetching} = useAccountsStore();

    useEffect(() => {
        if (otp != undefined) {
            form.setFieldValue("name", otp.name);
            form.setFieldValue("issuer", otp.issuer);
            form.setFieldValue("secret", otp.decryptedSecret!);
            form.setFieldValue("type", convertValueToEnum(AccountType, otp.type));
            form.setFieldValue("period", convertValueToEnum(AccountPeriod, otp.period));
            form.setFieldValue("algorithm", convertValueIndexToEnum(AccountAlgorithm, otp.algorithm));
            form.setFieldValue("digits", convertValueToEnum(AccountDigits, otp.digits));
        }
    }, [otp]);

    const form = useForm<AccountRequestDTO>({
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

    function onSubmit(accountRequestDTO: AccountRequestDTO) {
        if (otp == undefined) return;

        accountRequestDTO.secret = otp.secret;

        otpManagerApi({
            api: () => otp.unlocked === undefined ?
                AccountService.getInstance().update(accountRequestDTO) :
                SharedAccountService.getInstance().update(accountRequestDTO),
            titleOnLoading: "Editing account",
            messageOnLoading: "Account is being editing",
            titleOnSuccess: "Account edited",
            messageOnSuccess: (accountRequestDTO.issuer != ""
                ? accountRequestDTO.issuer + " (" + accountRequestDTO.name + ")"
                : accountRequestDTO.name) + " edited with success",
            onComplete: () => {
                setShowEditOtpAccount(undefined);
                setAccounts(undefined);
                setIsFetching(true);
            }
        });
    }

    return {form, onSubmit};
}

