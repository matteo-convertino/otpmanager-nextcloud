import appStoreImage from "@/assets/appstore.svg";
import {Box, Button, Image, Modal, Stack, Text} from "@mantine/core";
import {useModalsStore} from "@/context/useModalsStore.ts";

export function FeedbackIosApp() {
    const {showFeedbackIosApp, setShowFeedbackIosApp} = useModalsStore();

    return (
        <Modal
            opened={showFeedbackIosApp}
            onClose={() => setShowFeedbackIosApp(false)}
            title={<Text fw={700}>Feedback iOS app</Text>}
            centered={true}
        >
            <Stack spacing="sm">
                <Box py={"md"}>
                    <Image
                        src={appStoreImage}
                        width={120}
                        height={120}
                        fit="contain"
                        mx="auto"
                    />
                </Box>

                <Text fw={"bold"}>
                    Would you like to have the iOS app?
                </Text>
                <Text color="dimmed" size="md" maw={520}>
                    I'm planning to bring OTP Manager to the App Store. If you
                    think it would be useful, please share your feedback through
                    this short form.
                </Text>

                <Button
                    component="a"
                    href="https://forms.gle/neTUFwNrcqhdB4FR9"
                    target="_blank"
                    size="md"
                    fullWidth
                >
                    Leave feedback
                </Button>
            </Stack>
        </Modal>
    );
}
