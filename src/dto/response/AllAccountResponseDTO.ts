import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";
import type {SharedAccountResponseDTO} from "@/dto/response/SharedAccountResponseDTO.ts";

export type AllAccountResponseDTO = {
    accounts: AccountResponseDTO[]
    shared_accounts: SharedAccountResponseDTO[],
}
