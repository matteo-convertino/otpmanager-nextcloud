import {useAccountsStore} from "@/context/useAccountsStore.ts";
import useEncryption from "@/hooks/useEncryption.tsx";
import {HOTP, TOTP} from "otpauth";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";
import {OtpType} from "@/utils/enum/otpType.ts";
import {OtpPeriod} from "@/utils/enum/otpPeriod.ts";

export default function useAccountsCodeGeneration() {
    const {setAccounts} = useAccountsStore();
    const {decrypt} = useEncryption();

    const generateCodes = ({accounts, period}: {
        accounts?: AccountResponseDatatable[],
        period?: OtpPeriod
    }): void => {
        const nextAccounts = (accounts ?? useAccountsStore.getState().accounts)?.map((account) => {
            if (period !== undefined && (account.type !== OtpType.TOTP || account.period !== period)) {
                return account;
            }

            const nextAccount = {...account};

            if (nextAccount.unlocked === null || nextAccount.unlocked) {
                if (nextAccount.decryptedSecret === undefined) {
                    nextAccount.decryptedSecret = decrypt(nextAccount.secret);
                }

                if (nextAccount.type === OtpType.TOTP) {
                    const totp = new TOTP({
                        issuer: nextAccount.issuer,
                        label: nextAccount.name,
                        algorithm: nextAccount.algorithm,
                        digits: nextAccount.digits,
                        period: nextAccount.period,
                        secret: nextAccount.decryptedSecret,
                    });

                    nextAccount.code = totp.generate();
                } else if (nextAccount.counter === null || nextAccount.counter < 0) {
                    nextAccount.code = null;
                } else {
                    const hotp = new HOTP({
                        issuer: nextAccount.issuer,
                        label: nextAccount.name,
                        algorithm: nextAccount.algorithm,
                        digits: nextAccount.digits,
                        counter: nextAccount.counter,
                        secret: nextAccount.decryptedSecret,
                    });

                    nextAccount.code = hotp.generate();
                }
            } else {
                nextAccount.code = null;
            }

            return nextAccount;
        });

        if (nextAccounts !== undefined) setAccounts(nextAccounts);
    };

    return {generateCodes};
}
