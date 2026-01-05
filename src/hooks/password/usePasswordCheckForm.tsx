import PasswordService from "@/services/PasswordService.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import {SHA256} from "crypto-es";
import {useEffect} from "react";
import {useSecretStore} from "@/context/useSecretStore.ts";
import {passwordFormCheckSchema} from "@/dto/utils/passwordFormCheckSchema.ts";
import {z} from "zod";

export default function usePasswordCheckForm() {
    const otpManagerApi = useOtpManagerApi();
    const {setIv, setPassword, setPasswordHash, setAuth} = useSecretStore();

    const form = useForm({
        initialValues: {
            password: "",
            savePassword: false,
        },
        validate: zodResolver(passwordFormCheckSchema)
    });

    const onSubmit = (values: z.infer<typeof passwordFormCheckSchema>) => {

        otpManagerApi({
            api: () => PasswordService.getInstance().check({ password: values.password }),
            titleOnLoading: "Password",
            messageOnLoading: "Password is being checked",
            titleOnSuccess: "Password",
            messageOnSuccess: "Correct password",
            onComplete: (passwordResponseDTO) => {
                setIv(passwordResponseDTO.iv);
                setPassword(true);
                setPasswordHash(SHA256(values.password).toString());
                setAuth(true);
            },
        });
    }

    useEffect(() => {
        // if (password && localStorage.getItem("otpmanager_cached_password")) {
        //     form.setValues({
        //         password: localStorage.getItem("otpmanager_cached_password"),
        //     });
        // }
        console.log("TODO: auto login");
    }, []);

    return {form, onSubmit};
}

