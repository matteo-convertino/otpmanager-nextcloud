import {z} from "zod";

export const passwordFormCheckSchema = z.object({
    password: z
        .string()
        .min(1, {message: 'Password cannot be empty'}),
    savePassword: z.boolean(),
});

