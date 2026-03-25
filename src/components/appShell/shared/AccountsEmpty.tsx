import {Center, Stack, Text} from "@mantine/core";
import {IconDatabaseOff} from "@tabler/icons-react";

export function AccountsEmpty() {

    return (
        <Center h={"100%"}>
            <Stack align={"center"} spacing="xs">
                <IconDatabaseOff size={40}/>

                <Text color="dimmed">Add your first OTP account</Text>
            </Stack>
        </Center>
    );
}
