import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useState} from "react";
import {HOTP} from "otpauth";
import {convertValueIndexToEnum} from "@/utils/convertToEnum.ts";
import {AccountAlgorithm} from "@/utils/accountAlgorithm.ts";
import type {AccountResponseDatatable} from "@/dto/utils/AccountResponseDatatable.ts";
import AccountService from "@/services/AccountService.ts";
import type {UpdateCounterRequestDTO} from "@/dto/request/UpdateCounterRequestDTO.ts";
import SharedAccountService from "@/services/SharedAccountService.ts";

export default function useUpdateCounter() {
    const otpManagerApi = useOtpManagerApi();
    const [isUpdating, setIsUpdating] = useState(false);

    function onUpdate(account: AccountResponseDatatable) {
        setIsUpdating(true);

        const data: UpdateCounterRequestDTO = {secret: account.secret};

        otpManagerApi({
            api: () => account.unlocked === undefined
                ? AccountService.getInstance().updateCounter(data)
                : SharedAccountService.getInstance().updateCounter(data),
            showNotifications: false,
            onComplete: (accountResponseDTO) => {
                account.counter = accountResponseDTO.counter;

                let hotp = new HOTP({
                    issuer: account.issuer,
                    label: account.name,
                    algorithm: convertValueIndexToEnum(AccountAlgorithm, account.algorithm),
                    digits: account.digits,
                    counter: account.counter,
                    secret: account.decryptedSecret,
                });

                account.code = hotp.generate();

                setIsUpdating(false);
            }
        });


    }

    return {isUpdating, onUpdate};
}

