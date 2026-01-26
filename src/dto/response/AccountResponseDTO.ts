import type {OtpType} from "@/utils/enum/otpType.ts";
import type {OtpPeriod} from "@/utils/enum/otpPeriod.ts";
import type {OtpAlgorithm} from "@/utils/enum/otpAlgorithm.ts";
import type {OtpDigits} from "@/utils/enum/otpDigits.ts";

export type AccountResponseDTO = {
    id: number
    secret: string
    name: string
    issuer: string
    digits: OtpDigits
    type: OtpType
    period: OtpPeriod
    algorithm: OtpAlgorithm
    counter: number | null
    icon: string
    position: number
    userId: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}
