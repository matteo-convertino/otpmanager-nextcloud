import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";

export type AccountResponseDatatable = AccountResponseDTO & {
    decryptedSecret?: string
    code?: string
    unlocked?: boolean
    expired_at?: Date | null
}
