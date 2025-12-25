import {z} from "zod";

export const passwordFormSaveSchema = (
    {
        isChanging,
        getStrength
    }: {
        isChanging: boolean;
        getStrength: (password: string) => number;
    }) =>
    z
        .object({
            oldPassword: z.string().optional(),
            password: z.string(),
            confirmPassword: z.string(),
        })
        .superRefine((values, ctx) => {
            // oldPassword obbligatoria solo se si sta cambiando
            if (isChanging && !values.oldPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Old password cannot be empty",
                    path: ["oldPassword"],
                });
            }

            if (getStrength(values.password) !== 100) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Not all requirements are satisfied",
                    path: ["password"],
                });
            }

            if (values.confirmPassword !== values.password) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Passwords did not match",
                    path: ["confirmPassword"],
                });
            }
        });
