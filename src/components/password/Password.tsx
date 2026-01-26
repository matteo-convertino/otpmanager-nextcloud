import {AppShell, Box, Button, Card, Divider, Flex, Loader, Stack, Text,} from "@mantine/core";
import {useSecretStore} from "@/context/useSecretStore";
import PasswordCheckForm from "@/components/password/PasswordCheckForm.tsx";
import PasswordCreateForm from "@/components/password/PasswordCreateForm.tsx";


export const Password = () => {
    const {password} = useSecretStore();

    return (
        <AppShell padding="0" fixed={false} layout="alt">
            <Flex
                justify="center"
                align="center"
                sx={(theme) => ({
                    background:
                        theme.colorScheme === "dark"
                            ? "rgba(0, 0, 0, .8)"
                            : "rgba(255, 255, 255, .8)",
                    padding: "16px",
                    paddingBottom: "calc(var(--body-container-margin)*2 + 16px)",
                    paddingRight: "calc(var(--body-container-margin)*2 + 16px)",
                    height: "calc(100vh - 44px - 50px)",
                })}
            >
                {password === undefined ? (
                    <Loader/>
                ) : (
                    <Card w={500} shadow="xl" padding="lg" radius="lg" withBorder>
                        <Stack justify="space-between" h="100%">
                            <Box>
                                <Text size="lg" fw={700} ta="center">
                                    Authentication
                                </Text>
                                <Divider my="sm"/>
                            </Box>

                            {password ? <PasswordCheckForm/> : <PasswordCreateForm/>}

                            <Box>
                                <Divider my="md"/>
                                <Flex justify="flex-end">
                                    <Button type="submit" form="form">
                                        {password ? "Check" : "Create password"}
                                    </Button>
                                </Flex>
                            </Box>
                        </Stack>
                    </Card>
                )}
            </Flex>
        </AppShell>
    );
};
