import {Center, Stack, Text} from "@mantine/core";
import {IconDatabaseOff} from "@tabler/icons-react";

export function AccountsEmpty({message = "Add your first OTP account"}: { message?: string }) {

    return (
        <Center h={"100%"}>
            <Stack align={"center"} spacing="xs">
                <IconDatabaseOff size={40}/>

                <Text color="dimmed">{message}</Text>
            </Stack>
        </Center>
    );
}
