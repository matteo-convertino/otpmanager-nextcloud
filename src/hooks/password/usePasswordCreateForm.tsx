import PasswordService from "@/services/PasswordService.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import {SHA256} from "crypto-es";
import {useSecretStore} from "@/context/useSecretStore.ts";
import {passwordFormSaveSchema} from "@/dto/utils/passwordFormSaveSchema.ts";
import {getStrength} from "@/components/password/PasswordRequirement.tsx";
import type {passwordCreateFormType} from "@/dto/request/PasswordRequestDTO.ts";


export default function usePasswordCreateForm() {
    const otpManagerApi = useOtpManagerApi();
    const {setIv, setPassword, setPasswordHash, setAuth} = useSecretStore();

    const form = useForm<passwordCreateFormType>({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: zodResolver(passwordFormSaveSchema({isChanging: false, getStrength: getStrength}))
    });

    const onSubmit = (values: passwordCreateFormType) => {
        otpManagerApi({
            api: () => PasswordService.getInstance().create(values),
            titleOnLoading: "Password",
            messageOnLoading: "Password is being stored",
            titleOnSuccess: "Password",
            messageOnSuccess: "Password stored with success",
            onComplete: (passwordResponseDTO) => {
                setIv(passwordResponseDTO.iv);
                setPassword(true);
                setAuth(true);
                setPasswordHash(SHA256(values.password).toString());
            },
        });
    }

    return {form, onSubmit};
}

