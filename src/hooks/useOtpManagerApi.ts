import {callApi} from "@/hooks/utils/callApi.ts";
import useOtpManagerNotifications from "@/hooks/useOtpManagerNotifications.tsx";
import type {ReactNode} from "react";
import type {OcsMetaDTO} from "@/dto/OcsResponseDTO.ts";

export default function useOtpManagerApi() {
    const {
        showLoading,
        updateSuccess,
        updateError,
        showError,
        showErrors,
        updateErrors,
    } = useOtpManagerNotifications();

    return <T>(
        {
            api: api,
            titleOnSuccess,
            messageOnSuccess,
            iconOnSuccess,
            titleOnLoading,
            messageOnLoading,
            messageOnGenericError = "Generic error",
            onComplete,
            onError,
            onGenericError,
            showNotifications = true
        }: {
            api: () => Promise<T>
            titleOnSuccess?: string,
            messageOnSuccess?: string | ReactNode,
            iconOnSuccess?: ReactNode,
            titleOnLoading?: string,
            messageOnLoading?: string,
            messageOnGenericError?: string,
            onComplete?: (_: T) => void,
            onError?: (_: OcsMetaDTO) => void,
            onGenericError?: (_: unknown) => void,
            showNotifications?: boolean
        }): void => {

        if (showNotifications) {
            showLoading({
                title: titleOnLoading!,
                message: messageOnLoading!
            })
        }

        callApi<T>(
            {
                api: api,
                onComplete: (response) => {
                    if (showNotifications) {
                        updateSuccess({
                            title: titleOnSuccess!,
                            message: messageOnSuccess!,
                            icon: iconOnSuccess!,
                        });
                    }

                    onComplete?.(response);
                },
                onError: (errorDto) => {
                    if (showNotifications) {
                        updateErrors({errorDTO: errorDto})
                    } else {
                        showErrors({errorDTO: errorDto});

                    }

                    onError?.(errorDto);
                },
                onGenericError: (error) => {
                    if (showNotifications) {
                        updateError({
                            title: "Generic Error",
                            message: messageOnGenericError
                        });
                    } else {
                        showError({
                            title: "Generic Error",
                            message: messageOnGenericError
                        });
                    }

                    onGenericError?.(error);
                }
            }
        );
    }
}
