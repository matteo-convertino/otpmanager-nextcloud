import {Button, Group, Modal, Stack} from "@mantine/core";
import {IconKey} from "@tabler/icons-react";
import {useModalsStore} from "@/context/useModalsStore.ts";
import PasswordUpdateForm from "@/components/password/PasswordUpdateForm.tsx";

export function ChangePassword() {
    const {showChangePassword, setShowChangePassword} = useModalsStore();

    return (
        <Modal
            opened={showChangePassword}
            onClose={() => setShowChangePassword(false)}
            title="Change Password"
            centered
        >
            <Stack spacing="xl">
                <PasswordUpdateForm/>

                <Group position="right">
                    <Button
                        styles={{
                            icon: {
                                display: "inline",
                            },
                        }}
                        rightIcon={<IconKey/>}
                        type="submit"
                        form="form"
                    >
                        Change Password
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
