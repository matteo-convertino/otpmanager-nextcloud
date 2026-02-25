import {Drawer, Stack} from "@mantine/core";
import {navbarStyles} from "@/styles/components/NavbarStyles.tsx";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import {useNavbar} from "@/hooks/useNavbar.tsx";

export function NavbarSmallDevice() {
    const {classes/*, cx*/} = navbarStyles();
    const {showNavbarSmallDevice, setShowNavbarSmallDevice} = useSidebarStore();
    const {header, body, footer} = useNavbar();

    return (
        <>
            <Drawer
                padding="md"
                position="left"
                size={300}
                opened={showNavbarSmallDevice}
                onClose={() => setShowNavbarSmallDevice(false)}
                title={header}
                classNames={{header: classes.header}}
                styles={{
                    body: {
                        height: "calc(100% - 92px)",
                    },
                }}
            >
                <Stack h={"100%"} justify="space-between">
                    <div>
                        {body}
                    </div>

                    <div className={classes.footer}>
                        {footer}
                    </div>
                </Stack>
            </Drawer>
        </>
    );
}
