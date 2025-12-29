import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm} from "@mantine/form";
import {showNotification} from "@mantine/notifications";
import {IconX} from "@tabler/icons-react";
import AccountService from "@/services/AccountService.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import {useSecretStore} from "@/context/useSecretStore.ts";

export default function useImportAccountsForm({file}: { file?: File }) {
    const otpManagerApi = useOtpManagerApi();
    const {setShowImportExport} = useModalsStore();
    const {setAccounts, setIsFetching} = useAccountsStore();
    const {passwordHash} = useSecretStore();

    const form = useForm({
        initialValues: {password: ""},
    });

    function onSubmit() {
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
            try {
                otpManagerApi({
                    api: () => AccountService.getInstance().import({
                        data: JSON.parse(fileReader.result as string),
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
            } catch (e) {
                showNotification({
                    id: "import-accounts",
                    title: "Import Error",
                    message: "The file uploaded is not a .json file",
                    color: "red",
                    icon: <IconX size={16}/>,
                    autoClose: 2000,
                });
            }
        };

        if (file !== undefined) fileReader.readAsText(file);
    }

    return {form, onSubmit};
}

