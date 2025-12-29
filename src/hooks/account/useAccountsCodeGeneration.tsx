import {useAccountsStore} from "@/context/useAccountsStore.ts";
import useEncryption from "@/hooks/useEncryption.tsx";
import {convertValueIndexToEnum} from "@/utils/convertToEnum.ts";
import {AccountAlgorithm} from "@/utils/accountAlgorithm.ts";
import {HOTP, TOTP} from "otpauth";
import type {AccountResponseDatatable} from "@/dto/utils/AccountResponseDatatable.ts";

export default function useAccountsCodeGeneration() {
    const {setAccounts} = useAccountsStore();
    const {decrypt} = useEncryption();

    function generateCodes({accounts, setTimer}: {
        accounts: AccountResponseDatatable[],
        setTimer: (timer: number) => void
    }): void {
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];

            if (account.unlocked === undefined || account.unlocked == 1) {
                if (account.decryptedSecret === undefined) {
                    account.decryptedSecret = decrypt(account.secret);
                }

                if (account.type == "totp") {
                    let totp = new TOTP({
                        issuer: account.issuer,
                        label: account.name,
                        algorithm: convertValueIndexToEnum(AccountAlgorithm, account.algorithm),
                        digits: account.digits,
                        period: account.period,
                        secret: account.decryptedSecret,
                    });

                    account.code = totp.generate();
                } else if (account.counter < 0) {
                    account.code = "Click here to generate HOTP code";
                } else {
                    let hotp = new HOTP({
                        issuer: account.issuer,
                        label: account.name,
                        algorithm: convertValueIndexToEnum(AccountAlgorithm, account.algorithm),
                        digits: account.digits,
                        counter: account.counter,
                        secret: account.decryptedSecret,
                    });

                    account.code = hotp.generate();
                }
            } else {
                account.code = "Click here to unlock your shared account";
            }
        }

        setAccounts(accounts);

        // Regenerate codes when the current 30s window expires
        setTimer(
            setTimeout(
                () => generateCodes({accounts: accounts, setTimer: setTimer}),
                Math.round((30 - ((Date.now() / 1000) % 30)) * 1000)
            )
        );
    }

    return {generateCodes};
}

