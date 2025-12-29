import {AppShell} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";

import {NavbarLargeDevice} from "./../navbar/LargeDevice";
import {NavbarSmallDevice} from "./../navbar/SmallDevice";
import {AppShellContent} from "./Content";

import Aside from "./../aside/Aside";
import AsideInfo from "./../aside/Info";
import AsideShare from "./../aside/Share";
import {useSidebarStore} from "@/context/useSidebarStore.ts";

export default function MainAppShell() {
    const smallScreen = useMediaQuery("(max-width: 991px)");
    const {showAsideInfo, showAsideShare, setShowAsideInfo, setShowAsideShare} = useSidebarStore();

    return (
        <>
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
