import {Navbar} from "@mantine/core";
import {navbarStyles} from "@/styles/components/NavbarStyles.tsx";
import {useNavbar} from "@/hooks/useNavbar.tsx";

export function NavbarLargeDevice() {
    const {classes/*, cx*/} = navbarStyles();
    const {header, body, footer} = useNavbar();

    return (
        <>
            <Navbar
                hidden={true}
                hiddenBreakpoint="md"
                width={{min: 300, xs: 300}}
                p="md"
                mih="calc(100vh - 50px)"
            >
                <Navbar.Section className={classes.header}>
                    {header}
                </Navbar.Section>

                <Navbar.Section grow>
                    {body}
                </Navbar.Section>

                <Navbar.Section className={classes.footer}>
                    {footer}
                </Navbar.Section>
            </Navbar>
        </>
    );
}
