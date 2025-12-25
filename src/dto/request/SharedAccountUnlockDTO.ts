import {z} from 'zod'

export const sharedAccountUnlockSchema = z.object({
    tempPassword: z.string()
        .min(1, "Name is required")
        .max(256, "Name cannot be longer than 256 characters"),
})

export type SharedAccountUnlockDTO = z.infer<typeof sharedAccountUnlockSchema> & {
    accountId: number
    currentPassword: string
}
