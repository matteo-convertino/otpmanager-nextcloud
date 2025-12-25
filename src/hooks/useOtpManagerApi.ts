import {callApi} from "@/utils/callApi";
import useOtpManagerNotifications from "@/hooks/useOtpManagerNotifications.tsx";

export default function useOtpManagerApi() {
    const {
        showLoading,
        updateSuccess,
        updateError,
        showError,
    } = useOtpManagerNotifications();

    return <T>(
        {
            api: api,
            titleOnSuccess,
            messageOnSuccess,
            titleOnLoading,
            messageOnLoading,
            messageOnGenericError = "Generic error",
            onComplete,
            // onError,
            onGenericError,
            showNotifications = true
        }: {
            api: () => Promise<T>
            titleOnSuccess?: string,
            messageOnSuccess?: string,
            titleOnLoading?: string,
            messageOnLoading?: string,
            messageOnGenericError?: string,
            onComplete?: (_: T) => void,
            // onError?: (_: ErrorDTO) => void,
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
                            message: messageOnSuccess!
                        });
                    }

                    onComplete?.(response);
                },
                /*onError: (error) => {
                  if (error.status === 498) { // invalid jwt
                    if (showNotifications) notifications.hide(notificationId!);

                    showHireInfoNotification({
                      title: "Authentication",
                      message: "Your session has expired. Please log in again."
                    });

                    setUser(null);
                  } else {
                    showHireErrors({ notificationId: notificationId, errorDTO: error });
                  }

                  onError?.(error);
                },*/
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
