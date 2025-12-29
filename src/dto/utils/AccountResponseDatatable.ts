import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";

export type AccountResponseDatatable = AccountResponseDTO & {
    decryptedSecret?: string
    code?: string
    unlocked?: 0 | 1
    expired_at?: Date | null
}
