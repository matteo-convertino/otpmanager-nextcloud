import {Modal, Stack, Text} from "@mantine/core";

import KofiButton from "@/components/KofiButton.tsx";
import {useModalsStore} from "@/context/useModalsStore.ts";

export function Support() {
    const {showSupport, setShowSupport} = useModalsStore();

    return (
        <Modal
            opened={showSupport}
            onClose={() => setShowSupport(false)}
            title={<Text fw={700}>Become a Supporter</Text>}
            centered={true}
        >
            <Stack>
                <Text>
                    If OTP Manager is worth a cup of coffee ☕️ and helps you during the day,
                    you can support it with a small donation (even $1).
                </Text>
                <Text>
                    It helps me maintain the app and build new features.
                </Text>
                <KofiButton
                    username="matteoconvertino"
                    label="Support OTP Manager"
                />
            </Stack>
        </Modal>
    );
}
