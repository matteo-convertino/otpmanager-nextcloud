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
            // oldPassword is only required when changing password
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

            // confirmPassword is only required when creating password
            if (!isChanging && values.confirmPassword !== values.password) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Passwords did not match",
                    path: ["confirmPassword"],
                });
            }
        });
