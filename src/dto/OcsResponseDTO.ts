import {z} from "zod";

const OcsMessageSchema = z.preprocess((val) => {
        if (typeof val !== "string") return val;

        const trimmed = val.trim();

        const looksLikeJson =
            (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
            (trimmed.startsWith("{") && trimmed.endsWith("}"));

        if (!looksLikeJson) return val;

        try {
            return JSON.parse(trimmed);
        } catch {
            return val;
        }
    },
    z.union([
        z.string(),
        z.array(z.string()),
        z.record(z.string(), z.array(z.string())),
    ])
);

export const OcsMetaDTOSchema = z.object({
    status: z.string(),
    statuscode: z.number(),
    message: OcsMessageSchema
});

export type OcsMetaDTO = z.infer<typeof OcsMetaDTOSchema>;

export const OcsResponseDTOSchema = z.object({
    ocs: z.object({
        meta: OcsMetaDTOSchema,
        data: z.unknown(),
    }),
});

export type OcsResponseDTO<T> = {
    ocs: {
        meta: OcsMetaDTO;
        data: T;
    };
};
