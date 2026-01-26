import PasswordService from "@/services/PasswordService.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import {SHA256} from "crypto-es";
import {useEffect} from "react";
import {useSecretStore} from "@/context/useSecretStore.ts";
import {z} from "zod";
import {passwordFormCheckSchema} from "@/dto/request/PasswordRequestDTO.ts";
import {LOCAL_STORAGE_CACHED_PASSWORD_KEY} from "@/utils/localStorageKey.ts";

export default function usePasswordCheckForm() {
    const otpManagerApi = useOtpManagerApi();
    const {password, setIv, setPassword, setPasswordHash, setAuth} = useSecretStore();

    const form = useForm({
        initialValues: {
            password: "",
            savePassword: false,
        },
        validate: zodResolver(passwordFormCheckSchema)
    });

    const onSubmit = (values: z.infer<typeof passwordFormCheckSchema>) => {
        otpManagerApi({
            api: () => PasswordService.getInstance().check({password: values.password}),
            titleOnLoading: "Password",
            messageOnLoading: "Password is being checked",
            titleOnSuccess: "Password",
            messageOnSuccess: "Correct password",
            onComplete: (passwordResponseDTO) => {
                if(values.savePassword) localStorage.setItem(LOCAL_STORAGE_CACHED_PASSWORD_KEY, values.password)
                setIv(passwordResponseDTO.iv);
                setPassword(true);
                setPasswordHash(SHA256(values.password).toString());
                setAuth(true);
            },
        });
    }

    useEffect(() => {
        const cachedPassword = localStorage.getItem(LOCAL_STORAGE_CACHED_PASSWORD_KEY);
        if (password && cachedPassword !== null) {
            onSubmit({
                password: cachedPassword,
                savePassword: true,
            })
        }
    }, []);

    return {form, onSubmit};
}

