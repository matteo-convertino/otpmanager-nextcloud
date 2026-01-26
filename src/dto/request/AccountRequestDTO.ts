import {z} from 'zod'
import {OtpType} from "@/utils/enum/otpType.ts";
import {OtpPeriod} from "@/utils/enum/otpPeriod.ts";
import {OtpAlgorithm} from "@/utils/enum/otpAlgorithm.ts";
import {OtpDigits} from "@/utils/enum/otpDigits.ts";

export const accountRequestSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(256, "Name cannot be longer than 256 characters"),
    issuer: z.string()
        .max(256, "Issuer cannot be longer than 256 characters"),
    secret: z.string()
        .min(16, "Secret key cannot be shorter than 16 characters")
        .max(512, "Secret key cannot be longer than 16 characters")
        .regex(/^[A-Z2-7]+=*$/i, "Secret key is not Base32-encodable"),
    type: z.nativeEnum(OtpType),
    period: z.nativeEnum(OtpPeriod),
    algorithm: z.nativeEnum(OtpAlgorithm),
    digits: z.nativeEnum(OtpDigits),
})

export type AccountRequestSchemaForm = z.infer<typeof accountRequestSchema>

export type AccountRequestDTO = Omit<AccountRequestSchemaForm, "period" | "digits"> & {
    period: number
    digits: number
}

