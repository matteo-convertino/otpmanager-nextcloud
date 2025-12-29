import {z} from 'zod'
import {AccountType} from "@/utils/accountType.ts";
import {AccountPeriod} from "@/utils/accountPeriod.ts";
import {AccountAlgorithm} from "@/utils/accountAlgorithm.ts";
import {AccountDigits} from "@/utils/accountDigits.ts";

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
    type: z.nativeEnum(AccountType),
    period: z.nativeEnum(AccountPeriod),
    algorithm: z.nativeEnum(AccountAlgorithm),
    digits: z.nativeEnum(AccountDigits),
})

export type AccountRequestSchemaForm = z.infer<typeof accountRequestSchema>

export type AccountRequestDTO = Omit<AccountRequestSchemaForm, "period" | "digits"> & {
    period: number
    digits: number
}

