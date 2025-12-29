import {useState} from "react";

import {ActionIcon, Box, Checkbox, Collapse, Flex, Group, Text} from "@mantine/core";
import {
    IconApps,
    IconChevronLeft,
    IconChevronRight,
    IconFileInvoice,
    IconKey,
    IconList,
    IconLockOff,
    IconMoonStars,
    IconSettings,
    IconSun,
} from "@tabler/icons-react";
import {navbarStyles} from "../components/navbar/Styles.tsx";
import {useSettingsStore} from "@/context/useSettingsStore.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import useSettingsForm from "@/hooks/useSettingsForm.tsx";

export function useNavbar() {
    const [active/*, setActive*/] = useState("All accounts");
    const {classes, cx} = navbarStyles();
    const [showSettings, setShowSettings] = useState(false);
    const ChevronIcon = !showSettings ? IconChevronRight : IconChevronLeft;
    const {darkMode, showCodes} = useSettingsStore();
    const [passwordSaved, setPasswordSaved] = useState(
        Boolean(localStorage.getItem("otpmanager_cached_password"))
    );
    const {setShowChangePassword, setShowImportExport, setShowApps} = useModalsStore();
    const {isFetching: isFetchingSettings, onUpdate: onUpdateSettings} = useSettingsForm();

    const header = (
        <Text fw={700} fz="lg" ta="center">
            OTP Manager
        </Text>
    );

    const body = (
        <a
            className={cx(classes.link, {
                [classes.linkActive]: "All accounts" === active,
            })}
        >
            <IconList className={classes.linkIcon} stroke={1.5}/>
            <span>All accounts</span>
        </a>
    );

    const footer = (
        <div>
            <div
                className={classes.link}
                onClick={() => setShowApps(true)}
            >
                <IconApps className={classes.linkIcon} stroke={1.5}/>
                <span>Apps</span>
            </div>

            <Group
                position="apart"
                className={classes.link}
                spacing={0}
                onClick={() => setShowSettings((o) => !o)}
            >
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <IconSettings className={classes.linkIcon} stroke={1.5}/>
                    <Text>Settings</Text>
                </Box>

                <ChevronIcon
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
                    onChange={() => onUpdateSettings({showCodes: !showCodes}) }
                    className={classes.innerLink}
                    label="Show codes"
                    disabled={isFetchingSettings}
                />
                <Flex className={classes.innerLink} align="center">
                    <ActionIcon
                        variant="outline"
                        color={darkMode ? "yellow" : "blue"}
                        onClick={() => onUpdateSettings({darkMode: !darkMode})}
                        sx={{
                            width: "20px",
                            height: "20px",
                            minWidth: "20px",
                            minHeight: "20px",
                        }}
                        title="Toggle color scheme"
                        disabled={isFetchingSettings}
                    >
                        {darkMode ? (
                            <IconSun style={{width: 16}}/>
                        ) : (
                            <IconMoonStars style={{width: 16}}/>
                        )}
                    </ActionIcon>
                    <Text
                        sx={{
                            fontSize: "14px",
                            color: "#C1C2C5",
                            marginLeft: "12px",
                        }}
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
                        <IconLockOff style={{width: 16}}/>
                    </ActionIcon>
                    <Text
                        sx={{
                            fontSize: "14px",
                            color: "#C1C2C5",
                            marginLeft: "12px",
                        }}
                    >
                        Remove saved password
                    </Text>
                </Flex>

                <div
                    className={classes.link}
                    onClick={() => setShowChangePassword(true)}
                >
                    <IconKey className={classes.linkIcon} stroke={1.5}/>
                    <span>Change password</span>
                </div>
                <div
                    className={classes.link}
                    onClick={() => setShowImportExport(true)}
                >
                    <IconFileInvoice className={classes.linkIcon} stroke={1.5}/>
                    <span>Import / Export</span>
                </div>
            </Collapse>
        </div>
    );

    return {header, body, footer};
}
