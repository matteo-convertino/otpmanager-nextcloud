import {z} from 'zod'

export const sharedAccountCreateRequestSchema = z.object({
    users: z.string().array().min(1, "Users are required"),
    password: z.string().min(1, "Password is required"),
    expirationDate: z.date().nullable(),
})

export type SharedAccountCreateRequestSchemaForm = z.infer<typeof sharedAccountCreateRequestSchema>

export type SharedAccountCreateRequestDTO = Omit<SharedAccountCreateRequestSchemaForm, "expirationDate"> & {
    accountSecret: string
    sharedSecret: string
    iv: string
    expirationDate?: string
}

