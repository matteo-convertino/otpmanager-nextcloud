import useOtpManagerNotifications from "@/hooks/useOtpManagerNotifications.tsx";

export default function useCopy() {
    const {showSuccess, showError} = useOtpManagerNotifications();


    async function copy(value: string) {
        try {
            if (window.isSecureContext && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else if (!unsecuredCopyToClipboard(value)) {
                showError({
                    title: "Copy failed",
                    message: "There was an error while copying this value",
                });
            }

            showSuccess({
                title: "Copied to clipboard",
                message: "Value copied to clipboard with success",
            });
        } catch (_) {
            showError({
                title: "Copy failed",
                message: "There was an error while copying this value",
            });
        }
    }

    function unsecuredCopyToClipboard(text: string) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            if (document.execCommand("copy")) {
                document.body.removeChild(textArea);
                return true;
            }
        } catch (_) {
        }

        return false;
    }

    return {copy};
}

