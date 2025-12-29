import PasswordService from "@/services/PasswordService.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import {SHA256} from "crypto-es";
import {useSecretStore} from "@/context/useSecretStore.ts";
import {getStrength} from "@/components/password/PasswordRequirement.tsx";
import {passwordFormSaveSchema} from "@/dto/utils/passwordFormSaveSchema.ts";
import type {passwordUpdateFormType} from "@/dto/utils/passwordFormUpdateType.ts";


export default function usePasswordUpdateForm() {
    const otpManagerApi = useOtpManagerApi();
    const {setIv, setPassword, setPasswordHash} = useSecretStore();

    const form = useForm<passwordUpdateFormType>({
        initialValues: {
            oldPassword: "",
            password: "",
            confirmPassword: "",
        },
        validate: zodResolver(passwordFormSaveSchema({isChanging: false, getStrength: getStrength}))
    });

    const onSubmit = (values: passwordUpdateFormType) => {
        otpManagerApi({
            api: () => PasswordService.getInstance().update(values),
            titleOnLoading: "Password",
            messageOnLoading: "Password is being updated",
            titleOnSuccess: "Password",
            messageOnSuccess: "Password updated with success",
            onComplete: (passwordResponseDTO) => {
                setIv(passwordResponseDTO.iv);
                setPassword(true);
                setPasswordHash(SHA256(values.password).toString());
            },
        });
    }

    return {form, onSubmit};
}

