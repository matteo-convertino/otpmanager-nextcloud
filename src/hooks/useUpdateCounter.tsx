import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useState} from "react";
import {HOTP} from "otpauth";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";
import AccountService from "@/services/AccountService.ts";
import type {UpdateCounterRequestDTO} from "@/dto/request/UpdateCounterRequestDTO.ts";
import SharedAccountService from "@/services/SharedAccountService.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import type {SharedAccountResponseDTO} from "@/dto/response/SharedAccountResponseDTO.ts";
import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";

export default function useUpdateCounter() {
    const otpManagerApi = useOtpManagerApi();
    const [isUpdating, setIsUpdating] = useState(false);

    function onUpdate(account: AccountResponseDatatable) {
        setIsUpdating(true);

        const data: UpdateCounterRequestDTO = {id: account.id};

        otpManagerApi<SharedAccountResponseDTO | AccountResponseDTO>({
            api: () => account.isShared
                ? SharedAccountService.getInstance().updateCounter(data)
                : AccountService.getInstance().updateCounter(data),
            showNotifications: false,
            onComplete: (accountResponseDTO) => {
                if (accountResponseDTO.counter === null) return;

                account.counter = accountResponseDTO.counter;

                let hotp = new HOTP({
                    issuer: account.issuer,
                    label: account.name,
                    algorithm: account.algorithm,
                    digits: account.digits,
                    counter: account.counter,
                    secret: account.decryptedSecret,
                });

                account.code = hotp.generate();

                useAccountsStore.setState(
                    (state) => ({
                        accounts: state.accounts?.map((a) =>
                            a.id === account.id ? account : a
                        ),
                    })
                );

                setIsUpdating(false);
            }
        });
    }

    return {isUpdating, onUpdate};
}
