import {ActionIcon, Avatar, Group, type GroupProps} from "@mantine/core";
import {generateUrl} from "@nextcloud/router";
import {IconEdit, IconLockOpen, IconReload, IconShare, IconTrash, IconTrashX} from "@tabler/icons-react";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";
import useUpdateCounter from "@/hooks/useUpdateCounter.tsx";
import {OtpType} from "@/utils/enum/otpType.ts";
import useTrashOtpAccount from "@/hooks/account/useTrashOtpAccount.tsx";

export default function AccountActions(
    {
        account,
        groupProps,
        isTrash = false,
    }: {
        account: AccountResponseDatatable;
        groupProps?: GroupProps;
        isTrash?: boolean;
    }
) {
    const {setShowSharedAccountToUnlock, setShowEditOtpAccount, setShowDeleteOtpAccount} = useModalsStore();
    const {setShowAsideShare} = useSidebarStore();
    const {isUpdating: isUpdatingCounter, onUpdate: onUpdateCounter} = useUpdateCounter();
    const {onRestore, onDeletePermanently} = useTrashOtpAccount();

    if (isTrash) {
        return (
            <Group spacing={4} noWrap {...groupProps}>
                <ActionIcon
                    color="blue"
                    onClick={(event: MouseEvent) => {
                        event.stopPropagation();
                        onRestore(account);
                    }}
                >
                    <IconReload size={18}/>
                </ActionIcon>

                <ActionIcon
                    color="red"
                    onClick={(event: MouseEvent) => {
                        event.stopPropagation();
                        onDeletePermanently(account);
                    }}
                >
                    <IconTrashX size={18}/>
                </ActionIcon>
            </Group>
        );
    }

    return (
        <Group spacing={4} noWrap {...groupProps}>
            {account.unlocked === false && (
                <ActionIcon
                    onClick={(event: MouseEvent) => {
                        event.stopPropagation();
                        setShowSharedAccountToUnlock(account);
                    }}
                >
                    <IconLockOpen size={18}/>
                </ActionIcon>
            )}

            {account.type === OtpType.HOTP && account.unlocked !== false && (
                <ActionIcon
                    disabled={isUpdatingCounter}
                    onClick={(event: MouseEvent) => {
                        event.stopPropagation();
                        onUpdateCounter(account);
                    }}
                >
                    <IconReload size={18}/>
                </ActionIcon>
            )}

            {account.unlocked === true && (
                <Avatar
                    src={generateUrl("/avatar/" + account.userId + "/64")}
                    alt={account.userId}
                    radius="xl"
                    size="sm"
                />
            )}

            {!account.isShared && (
                <ActionIcon
                    onClick={(event: MouseEvent) => {
                        event.stopPropagation();
                        setShowAsideShare(account);
                    }}
                >
                    <IconShare size={18}/>
                </ActionIcon>
            )}

            <ActionIcon
                color="blue"
                onClick={(event: MouseEvent) => {
                    event.stopPropagation();
                    setShowEditOtpAccount(account);
                }}
            >
                <IconEdit size={16}/>
            </ActionIcon>

            <ActionIcon
                color="red"
                onClick={(event: MouseEvent) => {
                    event.stopPropagation();
                    setShowDeleteOtpAccount(account);
                }}
            >
                <IconTrash size={18}/>
            </ActionIcon>
        </Group>
    );
}
