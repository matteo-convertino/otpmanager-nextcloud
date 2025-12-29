import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";

export type SharedAccountResponseDTO = AccountResponseDTO & {
    account_id: number
    receiver_id: string
    unlocked: 0 | 1
    expired_at: Date
}
