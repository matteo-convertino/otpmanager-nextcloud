import {Box, Button, Group, Text} from "@mantine/core";
import {IconLock, IconLockOpen} from "@tabler/icons-react";
import useExportAccounts from "@/hooks/account/useExportAccounts.tsx";

export function ExportAccounts() {
    const {onExport} = useExportAccounts();

    return (
        <>
            <Text>Select how you want to export your accounts.</Text>
            <Box>
                <Text span>
                    Choose based on your needs whether to export them securely
                </Text>{" "}
                <Text fw={700} span>
                    with your encrypted secret key
                </Text>{" "}
                or{" "}
                <Text fw={700} span>
                    totally unencrypted
                </Text>
            </Box>

            <Group grow>
                <Button
                    styles={{
                        icon: {
                            display: "inline",
                        },
                    }}
                    rightIcon={<IconLock/>}
                    type="submit"
                    onClick={() => onExport(true)}
                >
                    Encrypted Export
                </Button>

                <Button
                    styles={{
                        icon: {
                            display: "inline",
                        },
                    }}
                    rightIcon={<IconLockOpen/>}
                    type="submit"
                    color="red"
                    onClick={() => onExport(false)}
                >
                    Plain Secret Export
                </Button>
            </Group>
        </>
    );
}
