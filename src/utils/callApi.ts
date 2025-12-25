// import { ErrorDTO, ErrorDTOSchema } from "@/dto/ErrorDTO";

export function callApi<T>(
  {
    api,
    onComplete,
    // onError,
    onGenericError
  }: {
    api: () => Promise<T>,
    onComplete?: (_: T) => void,
      // onError?: (_: ErrorDTO) => void,
    onGenericError?: (_: unknown) => void
  }) {
  api()
    .then(res => onComplete?.(res))
    .catch(e => {
        onGenericError?.(e);
      // const rawData = e?.response?.data;
      // const parsed = ErrorDTOSchema.safeParse(rawData);

      // parsed.success ? onError?.(parsed.data) : onGenericError?.(e);
    });
}
