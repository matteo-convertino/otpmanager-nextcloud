import {AppShell} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {useEffect} from "react";

import {NavbarLargeDevice} from "./../navbar/LargeDevice";
import {NavbarSmallDevice} from "./../navbar/SmallDevice";
import {AppShellContent} from "./Content";

import Aside from "./../aside/Aside";
import AsideInfo from "./../aside/Info";
import AsideShare from "./../aside/Share";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import useLoadSettings from "@/hooks/settings/useLoadSettings.tsx";
import useLoadAccounts from "@/hooks/account/useLoadAccounts.tsx";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import useAccountsCodeGeneration from "@/hooks/account/useAccountsCodeGeneration.tsx";
import {UpdateNews} from "@/components/modals/updateNews/UpdateNews.tsx";
import {useNavbarPageStore} from "@/context/useNavbarPageStore.ts";
import {NavbarPage} from "@/utils/enum/navbarPage.ts";

export default function MainAppShell() {
    const smallScreen = useMediaQuery("(max-width: 991px)");
    const {showAsideInfo, showAsideShare, setShowAsideInfo, setShowAsideShare} = useSidebarStore();
    const {startTotpTimers} = useAccountsStore();
    const {generateCodes} = useAccountsCodeGeneration();

    useLoadSettings();
    useLoadAccounts();

    useEffect(() => {
        startTotpTimers((period) => {
            if (useNavbarPageStore.getState().activePage === NavbarPage.TRASH) return;

            generateCodes({period});
        });
    }, [generateCodes, startTotpTimers]);

    return (
        <>
            <UpdateNews/>

            <Aside
                showAside={showAsideInfo !== undefined}
                setShowAside={setShowAsideInfo}
                title="Account Details"
            >
                <AsideInfo/>
            </Aside>

            <Aside
                showAside={showAsideShare !== undefined}
                setShowAside={setShowAsideShare}
                title="Account Sharing"
            >
                <AsideShare/>
            </Aside>

            <NavbarSmallDevice/>

            <AppShell
                padding="0"
                fixed={false}
                layout="alt"
                navbar={
                    <NavbarLargeDevice/>
                }
                styles={{
                    main: {
                        width: smallScreen ? "100vw" : "calc(100vw - 300px)",
                    },
                }}
            >
                <AppShellContent/>
            </AppShell>
        </>
    );
}
