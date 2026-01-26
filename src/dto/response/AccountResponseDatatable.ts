import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";
import type {ReceiverResponseDTO} from "@/dto/response/ReceiverResponseDTO.ts";

export type AccountResponseDatatable = AccountResponseDTO & {
    receiver: ReceiverResponseDTO | null
    unlocked: boolean | null
    expiredAt: Date | null
    isShared: boolean

    // custom (frontend side)
    decryptedSecret?: string
    code?: string | null
}
