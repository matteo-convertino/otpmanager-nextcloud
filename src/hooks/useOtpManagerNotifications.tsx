import {notifications} from "@mantine/notifications";
import {IconCheck, IconInfoCircle, IconX} from "@tabler/icons-react";
import notificationRandomId from "@/utils/notificationRandomId.ts";
import {NotificationType} from "@/utils/notificationType.ts";

type NotificationParams = {
    title: string;
    message: string;
};

export default function useOtpManagerNotifications() {
    const notificationId = notificationRandomId();

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.Error:
                return <IconX size={16}/>;
            case NotificationType.Success:
                return <IconCheck size={16}/>;
            default:
                return <IconInfoCircle size={16}/>;
        }
    };

    const getColor = (type: NotificationType) => {
        switch (type) {
            case NotificationType.Error:
                return "red";
            case NotificationType.Success:
                return "teal";
            case NotificationType.Loading:
                return "gray";
            default:
                return "blue";
        }
    };

    const showNotification = (
        type: NotificationType,
        {title, message}: NotificationParams,
        update = false
    ) => {
        const notificationProps = {
            id: notificationId,
            title,
            message,
            loading: type === NotificationType.Loading,
            withCloseButton: type !== NotificationType.Loading,
            autoClose: type === NotificationType.Loading ? false : 2000,
            color: getColor(type),
            icon: getIcon(type),
        };

        update ? notifications.update(notificationProps) : notifications.show(notificationProps);
    };

    const showLoading = (params: NotificationParams) =>
        showNotification(NotificationType.Loading, params);

    const showSuccess = (params: NotificationParams) =>
        showNotification(NotificationType.Success, params);

    const updateSuccess = (params: NotificationParams) =>
        showNotification(NotificationType.Success, params, true);

    const showError = (params: NotificationParams) =>
        showNotification(NotificationType.Error, params);

    const updateError = (params: NotificationParams) =>
        showNotification(NotificationType.Error, params, true);

    const showInfo = (params: NotificationParams) =>
        showNotification(NotificationType.Info, params);

    const showErrors = ({errorDTO}: {
        // errorDTO?: ErrorDTO
        errorDTO?: undefined
    }) => {
        if (errorDTO === undefined) {
            showError({
                title: "Generic error",
                message: "Internal server error",
            });
            /*} else {
              const { error: title, message } = errorDTO;

              if (typeof message === "string") {
                if (notificationId === undefined) {
                  showHireErrorNotification({ title, message });
                } else {
                  updateHireErrorNotification({ notificationId, title, message });
                }
              } else if (typeof message === "object") {
                if (notificationId !== undefined) notifications.hide(notificationId);

                for (const key in message) {
                  const value = message[key];

                  if (typeof value === "string") {
                    showHireErrorNotification({ title, message: value });
                  } else if (Array.isArray(value)) {
                    value.forEach((msg) => showHireErrorNotification({ title, message: msg }));
                  }
                }
              }*/
        }
    };

    return {
        showErrors,
        showLoading,
        showSuccess,
        updateSuccess,
        showInfo,
        updateError,
        showError,
    };
}





