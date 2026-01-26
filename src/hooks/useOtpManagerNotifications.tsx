import {notifications} from "@mantine/notifications";
import {IconCheck, IconInfoCircle, IconX} from "@tabler/icons-react";
import notificationRandomId from "@/utils/notificationRandomId.ts";
import {NotificationType} from "@/utils/notificationType.ts";
import type {ReactNode} from "react";
import type {OcsMetaDTO} from "@/dto/OcsResponseDTO.ts";
import {List, Stack, Text} from "@mantine/core";

type NotificationParams = {
    title: string;
    message: string | ReactNode;
    icon?: ReactNode;
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
        {title, message, icon}: NotificationParams,
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
            icon: icon === undefined ? getIcon(type) : icon,
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

    const showErrors = ({errorDTO}: { errorDTO: OcsMetaDTO }) =>
        handleErrors(errorDTO, showError);

    const updateErrors = ({errorDTO}: { errorDTO: OcsMetaDTO }) =>
        handleErrors(errorDTO, updateError);

    const handleErrors = (
        errorDTO: OcsMetaDTO,
        handler: (params: NotificationParams) => void,
    ) => {
        const title = getTitleByStatus(errorDTO.statuscode);
        const msg = errorDTO.message;

        if (typeof msg === "string") {
            handler({title, message: msg});
        } else if (Array.isArray(msg)) {
            handler({
                title,
                message: (
                    // <Spoiler maxHeight={150} showLabel={"Show more"} hideLabel={"Hide"}>
                    <List spacing={2} size="sm">
                        {msg.map((v, i) => (
                            <List.Item key={i}>{v}</List.Item>
                        ))}
                    </List>
                    // </Spoiler>
                ),
            });
        } else {
            const errors = Object.entries(msg);

            handler({
                title,
                message: (
                    // <Spoiler maxHeight={150} showLabel={"Show more"} hideLabel={"Hide"}>
                    <Stack>
                        {errors.map(([key, values]) => (
                            <Stack key={key} spacing={0}>
                                <Text fw={600}>{key}</Text>

                                <List spacing={2} size="sm">
                                    {values.map((v, i) => (
                                        <List.Item key={i}>{v}</List.Item>
                                    ))}
                                </List>
                            </Stack>
                        ))}
                    </Stack>
                    // </Spoiler>
                ),
            });
        }
    };

    const getTitleByStatus = (status: number) => {
        if (status >= 500) return "Server error";
        if (status === 404) return "Not found";
        if (status === 401) return "Unauthorized";
        if (status === 403) return "Access denied";
        if (status === 400) return "Invalid request";
        if (status === 409) return "Conflict";
        if (status === 422) return "Validation error";
        if (status >= 400) return "Request error";

        return "Something went wrong";
    };

    return {
        showErrors,
        showLoading,
        showSuccess,
        updateSuccess,
        showInfo,
        updateError,
        showError,
        updateErrors,
    };
}





