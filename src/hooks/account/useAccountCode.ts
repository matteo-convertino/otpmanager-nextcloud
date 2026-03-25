import {useSettingsStore} from "@/context/useSettingsStore.ts";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";
import useCopy from "@/hooks/useCopy.tsx";
import {OtpType} from "@/utils/enum/otpType.ts";

const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

export default function useAccountCode() {
    const {showCodes} = useSettingsStore();
    const {copy} = useCopy();

    function canCopyCode(account: AccountResponseDatatable): boolean {
        return account.code !== undefined && account.code !== null;
    }

    function shouldShowCode(account: AccountResponseDatatable): boolean {
        return showCodes
            || isTouchDevice
            || account.unlocked === false
            || (account.type === OtpType.HOTP && account.counter !== null && account.counter < 0);
    }

    function getCodeLabel(account: AccountResponseDatatable): string {
        if (account.code === undefined) return "";

        if (account.code !== null) return account.code;

        if (account.unlocked === false) return "Click to unlock your shared account";
        if (account.type === OtpType.HOTP) return "Click to generate HOTP code";

        return "";
    }

    function copyCode(account: AccountResponseDatatable) {
        if (!canCopyCode(account)) return;

        copy(account.code as string);
    }

    return {
        canCopyCode,
        shouldShowCode,
        getCodeLabel,
        copyCode,
    };
}
