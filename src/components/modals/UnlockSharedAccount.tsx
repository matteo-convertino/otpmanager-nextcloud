import {useDisclosure} from "@mantine/hooks";
import {Button, Flex, Modal, PasswordInput, Stack} from "@mantine/core";
import {useModalsStore} from "@/context/useModalsStore.ts";
import useUnlockSharedAccountForm from "@/hooks/useUnlockSharedAccountForm.tsx";

export function UnlockSharedAccount() {
    const [visible, {toggle}] = useDisclosure(false);
    const {showSharedAccountToUnlock, setShowSharedAccountToUnlock} = useModalsStore();
    const {form, onSubmit} = useUnlockSharedAccountForm();

    return (
        <Modal
            opened={showSharedAccountToUnlock !== undefined}
            onClose={() => setShowSharedAccountToUnlock(undefined)}
            title="Unlock Shared Account"
            centered
        >
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <Stack spacing="xl">
                    <PasswordInput
                        label="Password"
                        description="Insert the password that was used to share this account"
                        visible={visible}
                        onVisibilityChange={toggle}
                        {...form.getInputProps("tempPassword")}
                    />

                    <Flex justify="flex-end">
                        <Button type="submit">Unlock</Button>
                    </Flex>
                </Stack>
            </form>
        </Modal>
    );
}
