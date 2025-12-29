import {Button, Group, Modal, Stack, Text} from "@mantine/core";
import {useModalsStore} from "@/context/useModalsStore.ts";
import useDeleteOtpAccount from "@/hooks/account/useDeleteOtpAccount.tsx";

export function DeleteOtpAccount() {
    const {showDeleteOtpAccount: otp, setShowDeleteOtpAccount} = useModalsStore();
    const {onDelete} = useDeleteOtpAccount();

    return (
        <Modal
            opened={otp !== undefined}
            onClose={() => setShowDeleteOtpAccount(undefined)}
            title="Delete Account"
            centered
        >
            <Stack spacing={"xl"}>
                <Text size="sm">
                    Are you sure that you want to remove{" "}
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
                        Delete
                    </Button>
                </Group>
            </Stack>

        </Modal>
    );
}
