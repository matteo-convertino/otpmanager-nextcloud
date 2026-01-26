import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm} from "@mantine/form";
import AccountService from "@/services/AccountService.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import {useSecretStore} from "@/context/useSecretStore.ts";
import useOtpManagerNotifications from "@/hooks/useOtpManagerNotifications.tsx";

export default function useImportAccountsForm({file}: { file?: File }) {
    const otpManagerApi = useOtpManagerApi();
    const {setShowImportExport} = useModalsStore();
    const {setAccounts, setIsFetching} = useAccountsStore();
    const {passwordHash} = useSecretStore();
    const {showError} = useOtpManagerNotifications();

    const form = useForm({
        initialValues: {
            password: ""
        },
    });

    function onSubmit() {

        const fileReader = new FileReader();

        fileReader.onloadend = () => {
            if (fileReader.result === null) {
                showError({
                    title: "Import Error",
                    message: "The file uploaded is not a .json file",
                });
                return;
            }

            let data: any;

            try {
                data = JSON.parse(fileReader.result as string);
            } catch {
                showError({
                    title: "Import Error",
                    message: "The file uploaded is not a .json file",
                });
                return;
            }

            if(data.accounts === undefined) {
                showError({
                    title: "Import Error",
                    message: "There is no accounts to import in your file",
                });
                return;
            }

            // const parsed = importAccountsFromFileSchema.safeParse(fileReader.result as string);
            //
            // if (!parsed.success) {
            //     showError({
            //         title: "Import Error",
            //         message: (
            //             <List spacing={2} size="sm">
            //                 {parsed.error.errors.map((v, i) => (
            //                     <List.Item key={i}>
            //                         <Text fw={"bold"} span>{`${v.path.join('.')}`}</Text>: {v.message}
            //                     </List.Item>
            //                 ))}
            //             </List>
            //         ),
            //     })
            //     return;
            // }

            otpManagerApi({
                api: () => AccountService.getInstance().import({
                    accounts: data.accounts,
                    iv: data.iv,
                    passwordUsedOnExport: form.values.password,
                    currentPassword: passwordHash,
                }),
                titleOnLoading: "Import Accounts",
                messageOnLoading: "Accounts are being imported",
                titleOnSuccess: "Import Accounts",
                messageOnSuccess: "Accounts imported with success",
                onComplete: () => {
                    setShowImportExport(false);
                    setAccounts(undefined);
                    setIsFetching(true);
                }
            });
        };

        if (file !== undefined) fileReader.readAsText(file);
        else {
            showError({
                title: "Import Error",
                message: "The file is required",
            });
        }

    }

    return {form, onSubmit};
}

