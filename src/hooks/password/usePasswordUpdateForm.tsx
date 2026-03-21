import PasswordService from "@/services/PasswordService.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import {SHA256} from "crypto-es";
import {useSecretStore} from "@/context/useSecretStore.ts";
import {getStrength} from "@/components/password/PasswordRequirement.tsx";
import {passwordFormSaveSchema} from "@/dto/utils/passwordFormSaveSchema.ts";
import type {passwordUpdateFormType} from "@/dto/request/PasswordUpdateRequestDTO.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";


export default function usePasswordUpdateForm() {
    const otpManagerApi = useOtpManagerApi();
    const {setIv, setPassword, setPasswordHash} = useSecretStore();
    const {setShowChangePassword} = useModalsStore();
    const {setAccounts, setIsFetching} = useAccountsStore();

    const form = useForm<passwordUpdateFormType>({
        initialValues: {
            oldPassword: "",
            password: "",
            confirmPassword: "",
        },
        validate: zodResolver(passwordFormSaveSchema({isChanging: true, getStrength: getStrength}))
    });

    const onSubmit = (values: passwordUpdateFormType) => {
        otpManagerApi({
            api: () => PasswordService.getInstance().update({
                oldPassword: SHA256(values.oldPassword).toString(),
                newPassword: values.password
            }),
            titleOnLoading: "Password",
            messageOnLoading: "Password is being updated",
            titleOnSuccess: "Password",
            messageOnSuccess: "Password updated with success",
            onComplete: (passwordResponseDTO) => {
                setIv(passwordResponseDTO.iv);
                setPassword(true);
                setPasswordHash(SHA256(values.password).toString());
                setShowChangePassword(false);
                setAccounts(undefined);
                setIsFetching(true);
            },
        });
    }

    return {form, onSubmit};
}

