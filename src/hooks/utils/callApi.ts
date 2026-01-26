import {type OcsMetaDTO, OcsResponseDTOSchema} from "@/dto/OcsResponseDTO.ts";

export function callApi<T>(
    {
        api,
        onComplete,
        onError,
        onGenericError
    }: {
        api: () => Promise<T>,
        onComplete?: (_: T) => void,
        onError?: (_: OcsMetaDTO) => void,
        onGenericError?: (_: unknown) => void
    }) {
    api()
        .then(res => onComplete?.(res))
        .catch(e => {
            const rawData = e?.response?.data;
            const parsed = OcsResponseDTOSchema.safeParse(rawData);

            parsed.success ? onError?.(parsed.data.ocs.meta) : onGenericError?.(e);
        });
}
