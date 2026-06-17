import {ActionIcon, Breadcrumbs, Burger, Center, Flex, Group, Header, Loader, Text,} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons-react";

import {CreateOtpAccount} from "../modals/CreateOtpAccount";
import {EditOtpAccount} from "../modals/EditOtpAccount";
import {ChangePassword} from "../modals/ChangePassword";
import {ImportExport} from "../modals/ImportExport";
import {UnlockSharedAccount} from "../modals/UnlockSharedAccount";

import {Apps} from "../modals/Apps";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import {DeleteOtpAccount} from "@/components/modals/DeleteOtpAccount.tsx";
import {Support} from "@/components/modals/Support.tsx";
import {FeedbackIosApp} from "@/components/modals/FeedbackIosApp.tsx";
import {useSettingsStore} from "@/context/useSettingsStore.ts";
import {OtpViewMode} from "@/utils/enum/otpViewMode.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import type {DataTableSortStatus} from "mantine-datatable";
import {AccountsGrid} from "@/components/appShell/grid/AccountsGrid.tsx";
import AccountsDatatable from "@/components/appShell/table/AccountsDatatable.tsx";
import {sortAccounts as sortAccountsByStatus} from "@/utils/sortAccounts.ts";
import {useNavbarPageStore} from "@/context/useNavbarPageStore.ts";
import {NavbarPage} from "@/utils/enum/navbarPage.ts";

export function AppShellContent() {
    const {showNavbarSmallDevice, setShowNavbarSmallDevice} = useSidebarStore();
    const {setShowCreateAccount} = useModalsStore();
    const {viewMode} = useSettingsStore();

    const {accounts, setAccounts} = useAccountsStore();
    const {isFetching: isFetchingSettings} = useSettingsStore();
    const {activePage} = useNavbarPageStore();
    const isTrash = activePage === NavbarPage.TRASH;

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: "position",
        direction: "asc",
    });
    const sortStatusRef = useRef(sortStatus);

    const sortAccounts = useCallback((accounts: AccountResponseDatatable[]) => {
        const currentSortStatus = sortStatusRef.current;
        return sortAccountsByStatus(accounts, currentSortStatus);
    }, []);

    useEffect(() => {
        sortStatusRef.current = sortStatus;
        if (accounts === undefined) return;

        setAccounts(sortAccounts(accounts));
    }, [sortStatus]);

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
                        <Text c="dimmed">{activePage}</Text>

                        {!isTrash && (
                            <ActionIcon
                                sx={{display: "inline"}}
                                variant="transparent"
                                color="blue"
                                onClick={() => setShowCreateAccount(true)}
                            >
                                <IconCirclePlus/>
                            </ActionIcon>
                        )}
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
                align={"start"}
            >

                {
                    isFetchingSettings
                        ? <Center h={"100%"}>
                            <Loader/>
                        </Center>
                        : viewMode === OtpViewMode.TABLE
                            ? <AccountsDatatable
                                sortStatus={sortStatus}
                                setSortStatus={setSortStatus}
                                isTrash={isTrash}
                            />
                            : <AccountsGrid isTrash={isTrash}/>
                }

            </Group>

            <CreateOtpAccount/>

            <EditOtpAccount/>

            <DeleteOtpAccount/>

            <ChangePassword/>

            <ImportExport/>

            <UnlockSharedAccount/>

            <Apps/>

            <Support/>

            <FeedbackIosApp/>
        </>
    );
}
