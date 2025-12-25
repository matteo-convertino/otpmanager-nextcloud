import { useState } from "react";

import {
    ActionIcon,
    Box,
    Checkbox,
    Collapse,
    Flex,
    Group,
    Navbar,
    Text,
} from "@mantine/core";
import {
    IconApps,
    IconChevronLeft,
    IconChevronRight,
    IconFileInvoice,
    IconKey,
    IconList,
    IconMoonStars,
    IconSettings,
    IconSun,
    IconLockOff,
} from "@tabler/icons-react";
import { navbarStyles } from "./Styles";
import {useSettingsStore} from "@/context/useSettingsStore";
import {useModalsStore} from "@/context/useModalsStore.ts";

export function NavbarLargeDevice() {
    const [active, setActive] = useState("All accounts");
    const { classes, cx } = navbarStyles();
    const [ showSettings, setShowSettings] = useState(false);
    const ChevronIcon = !showSettings ? IconChevronRight : IconChevronLeft;
    const { darkMode, setDarkMode, showCodes, setShowCodes } = useSettingsStore();
    const [passwordSaved, setPasswordSaved] = useState(
        Boolean(localStorage.getItem("otpmanager_cached_password"))
    );
    const {setShowChangePassword, setShowImportExport, setShowApps} = useModalsStore();

    return (
        <>
            <Navbar
                hidden={true}
                hiddenBreakpoint="md"
                width={{ min: 300, xs: 300 }}
                p="xs"
                mih="calc(100vh - 50px)"
            >
                <Navbar.Section className={classes.header}>
                    <Text fw={700} fz="lg" ta="center">
                        OTP Manager
                    </Text>
                </Navbar.Section>

                <Navbar.Section grow>
                    <a
                        className={cx(classes.link, {
                            [classes.linkActive]: "All accounts" === active,
                        })}
                    >
                        <IconList className={classes.linkIcon} stroke={1.5} />
                        <span>All accounts</span>
                    </a>
                </Navbar.Section>

                <Navbar.Section className={classes.footer}>
                    <div
                        href="#"
                        className={classes.link}
                        onClick={(event) => setShowApps(true)}
                    >
                        <IconApps className={classes.linkIcon} stroke={1.5} />
                        <span>Apps</span>
                    </div>

                    <Group
                        position="apart"
                        className={classes.link}
                        spacing={0}
                        onClick={() => setShowSettings((o) => !o)}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconSettings className={classes.linkIcon} stroke={1.5} />
                            <Text>Settings</Text>
                        </Box>

                        <ChevronIcon
                            className={classes.chevron}
                            size="16px"
                            stroke={1.5}
                            style={{
                                transform: showSettings ? "rotate(-90deg)" : "none",
                            }}
                        />
                    </Group>

                    <Collapse in={showSettings}>
                        <Checkbox
                            checked={showCodes}
                            onChange={() =>
                                setShowCodes(!showCodes)}
                            className={classes.innerLink}
                            label="Show codes"
                        />
                        <Flex className={classes.innerLink} align="center">
                            <ActionIcon
                                variant="outline"
                                color={darkMode ? "yellow" : "blue"}
                                onClick={() =>
                                    setDarkMode(!darkMode)
                                }
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    minWidth: "20px",
                                    minHeight: "20px",
                                }}
                                title="Toggle color scheme"
                            >
                                {darkMode ? (
                                    <IconSun style={{ width: 16 }} />
                                ) : (
                                    <IconMoonStars style={{ width: 16 }} />
                                )}
                            </ActionIcon>
                            <Text
                                sx={{ fontSize: "14px", color: "#C1C2C5", marginLeft: "12px" }}
                            >
                                {"Switch to " +
                                    (darkMode ? "light mode" : "dark mode")}
                            </Text>
                        </Flex>

                        <Flex className={classes.innerLink} align="center">
                            <ActionIcon
                                variant="outline"
                                color="red"
                                onClick={() => {
                                    localStorage.removeItem("otpmanager_cached_password");
                                    setPasswordSaved(false);
                                }}
                                disabled={!passwordSaved}
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    minWidth: "20px",
                                    minHeight: "20px",
                                }}
                                title="Remove saved password"
                            >
                                <IconLockOff style={{ width: 16 }} />
                            </ActionIcon>
                            <Text
                                sx={{ fontSize: "14px", color: "#C1C2C5", marginLeft: "12px" }}
                            >
                                Remove saved password
                            </Text>
                        </Flex>

                        <div
                            href="#"
                            className={classes.link}
                            onClick={(event) => setShowChangePassword(true)}
                        >
                            <IconKey className={classes.linkIcon} stroke={1.5} />
                            <span>Change password</span>
                        </div>
                        <div
                            href="#"
                            className={classes.link}
                            onClick={(event) => setShowImportExport(true)}
                        >
                            <IconFileInvoice className={classes.linkIcon} stroke={1.5} />
                            <span>Import / Export</span>
                        </div>
                    </Collapse>
                </Navbar.Section>
            </Navbar>
        </>
    );
}
