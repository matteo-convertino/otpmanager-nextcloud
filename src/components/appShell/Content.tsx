import {ActionIcon, Anchor, Breadcrumbs, Burger, Flex, Group, Header, Text,} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons-react";

import {AccountsTable} from "./accountsTable/AccountsTable";
import {CreateOtpAccount} from "../modals/CreateOtpAccount";
import {EditOtpAccount} from "../modals/EditOtpAccount";
import {ChangePassword} from "../modals/ChangePassword";
import {ImportExport} from "../modals/ImportExport";
import {UnlockSharedAccount} from "../modals/UnlockSharedAccount";

import {Apps} from "../modals/Apps";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";

export function AppShellContent() {
    const {showNavbarSmallDevice, setShowNavbarSmallDevice} = useSidebarStore();
    const {setShowCreateAccount} = useModalsStore();

    return (
        <>
            <Header height={44} mb={0}>
                <Flex align="center" h="100%">
                    <Burger
                        opened={showNavbarSmallDevice}
                        onClick={() => setShowNavbarSmallDevice(true)}
                        size="sm"
                        ml={4}
                        display={{base: "block", md: "none"}}
                    />

                    <Breadcrumbs separator="→" ml="md">
                        <Anchor href="#" variant="text" color="dimmed">
                            <Text c="dimmed">All accounts</Text>
                        </Anchor>

                        <ActionIcon
                            sx={{display: "inline"}}
                            variant="transparent"
                            color="blue"
                            onClick={() => setShowCreateAccount(true)}
                        >
                            <IconCirclePlus/>
                        </ActionIcon>
                    </Breadcrumbs>
                </Flex>
            </Header>

            <Group
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
                grow
            >
                <AccountsTable/>
            </Group>

            <CreateOtpAccount/>

            <EditOtpAccount/>

            <ChangePassword/>

            <ImportExport/>

            <UnlockSharedAccount/>

            <Apps/>
        </>
    );
}
