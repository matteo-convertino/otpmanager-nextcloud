import {useAccountsStore} from "@/context/useAccountsStore.ts";
import {useSecretStore} from "@/context/useSecretStore.ts";

export default function useExportAccounts() {
    const {accounts} = useAccountsStore();
    const {iv} = useSecretStore();

    function onExport(encrypted: boolean) {
        if (accounts === undefined) return;

        let accountsToExport = accounts.map((account) => {
            const {decryptedSecret, id, createdAt, updatedAt, deletedAt, userId, position, code, ...rest} = account;

            return {
                ...rest,
                secret: encrypted ? rest.secret : (decryptedSecret ?? rest.secret),
            };
        });

        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(
                encrypted
                    ? {accounts: accountsToExport, iv: iv}
                    : {accounts: accountsToExport}
            )
        )}`;

        const link = document.createElement("a");

        link.href = jsonString;
        link.download = encrypted
            ? "accounts_encrypted_secret.json"
            : "accounts_plain_secret.json";

        link.click();
    }

    return {onExport};
}

