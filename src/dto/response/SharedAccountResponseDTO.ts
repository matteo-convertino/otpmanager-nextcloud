import type {ReceiverResponseDTO} from "@/dto/response/ReceiverResponseDTO.ts";
import type {OtpDigits} from "@/utils/enum/otpDigits.ts";
import type {OtpType} from "@/utils/enum/otpType.ts";
import type {OtpPeriod} from "@/utils/enum/otpPeriod.ts";
import type {OtpAlgorithm} from "@/utils/enum/otpAlgorithm.ts";

export type SharedAccountResponseDTO = {
    id: number
    secret: string
    name: string
    issuer: string
    digits: OtpDigits | null
    type: OtpType | null
    period: OtpPeriod | null
    algorithm: OtpAlgorithm | null
    counter: number | null
    icon: string
    position: number
    userId: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    receiver: ReceiverResponseDTO
    unlocked: boolean
    expiredAt: Date | null
}
