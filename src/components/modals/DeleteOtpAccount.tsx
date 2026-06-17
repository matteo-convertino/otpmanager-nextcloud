import {Button, Group, Modal, Stack, Text} from "@mantine/core";
import {useModalsStore} from "@/context/useModalsStore.ts";
import useDeleteOtpAccount from "@/hooks/account/useDeleteOtpAccount.tsx";

export function DeleteOtpAccount() {
    const {showDeleteOtpAccount: otp, deleteOtpAccountAction, setShowDeleteOtpAccount} = useModalsStore();
    const {onDelete} = useDeleteOtpAccount();
    const isDestroy = deleteOtpAccountAction === "destroy";

    return (
        <Modal
            opened={otp !== undefined}
            onClose={() => setShowDeleteOtpAccount(undefined)}
            title={isDestroy ? "Delete Account Permanently" : "Delete Account"}
            centered
        >
            <Stack spacing={"xl"}>
                <Text size="sm">
                    Are you sure that you want to {isDestroy ? "permanently delete" : "remove"}{" "}
                    {otp?.issuer != ""
                        ? otp?.issuer + " (" + otp?.name + ")"
                        : otp.name}
                    ?
                </Text>

                <Group position="right">
                    <Button onClick={() => setShowDeleteOtpAccount(undefined)} variant={"default"}>
                        Cancel
                    </Button>
                    <Button onClick={onDelete} color={"red"}>
                        {isDestroy ? "Delete permanently" : "Delete"}
                    </Button>
                </Group>
            </Stack>

        </Modal>
    );
}
