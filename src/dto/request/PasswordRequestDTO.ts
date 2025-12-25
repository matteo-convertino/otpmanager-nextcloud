import {z} from 'zod'

export const passwordRequestSchema = z.object({
    password: z.string()
        .min(1, "Name is required")
        .max(256, "Name cannot be longer than 256 characters"),
})

export type PasswordRequestDTO = z.infer<typeof passwordRequestSchema>
