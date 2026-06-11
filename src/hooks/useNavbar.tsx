import {useState} from "react";

import {ActionIcon, Box, Button, Checkbox, Collapse, Flex, Group, SegmentedControl, Text} from "@mantine/core";
import {
    IconApps,
    IconBrandApple,
    IconChevronLeft,
    IconChevronRight,
    IconFileInvoice,
    IconGridDots,
    IconKey,
    IconList,
    IconLockOff,
    IconMoonStars,
    IconSettings,
    IconSun,
    IconTable,
} from "@tabler/icons-react";
import {navbarStyles} from "@/styles/components/NavbarStyles.tsx";
import {useSettingsStore} from "@/context/useSettingsStore.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import useSettingsForm from "@/hooks/settings/useSettingsForm.tsx";
import {LOCAL_STORAGE_CACHED_PASSWORD_KEY} from "@/utils/localStorageKey.ts";
import birdWavingLottie from "@/assets/bird_waving.json";
import Lottie from "lottie-react";
import useLottie from "@/hooks/useLottie.tsx";
import {OtpViewMode} from "@/utils/enum/otpViewMode.ts";


export function useNavbar() {
    const [active/*, setActive*/] = useState("All accounts");
    const {classes, cx} = navbarStyles();
    const [showSettings, setShowSettings] = useState(false);
    const ChevronIcon = !showSettings ? IconChevronRight : IconChevronLeft;
    const {darkMode, showCodes, viewMode, isFetching: isFetchingSettings} = useSettingsStore();
    const [passwordSaved, setPasswordSaved] = useState(
        Boolean(localStorage.getItem(LOCAL_STORAGE_CACHED_PASSWORD_KEY))
    );
    const {
        setShowChangePassword,
        setShowImportExport,
        setShowApps,
        setShowSupport,
        setShowFeedbackIosApp,
    } = useModalsStore();
    const {onUpdate: onUpdateSettings} = useSettingsForm();

    const {lottieRef: birdWavingLottieRef, onDOMLoaded: onBirdWavingLottieLoaded} = useLottie(0.5);

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
            <Button
                leftIcon={
                    <Lottie
                        lottieRef={birdWavingLottieRef}
                        animationData={birdWavingLottie}
                        loop={true}
                        autoplay={false}
                        onDOMLoaded={onBirdWavingLottieLoaded}
                        style={{height: 30, width: 30}}
                    />
                }
                variant="gradient"
                gradient={{from: 'yellow.2', to: 'yellow.4'}}
                fullWidth
                mb={"md"}
                onClick={() => setShowSupport(true)}>
                <Text c={'yellow.9'}>Support me</Text>
            </Button>

            <Button
                styles={{
                    icon: {
                        display: "inline",
                    },
                }}
                leftIcon={<IconBrandApple/>}
                variant="outline"
                fullWidth
                mb={"md"}
                onClick={() => setShowFeedbackIosApp(true)}
            >
                iOS App
            </Button>

            <SegmentedControl
                fullWidth
                mb={"md"}
                value={viewMode}
                onChange={(v) => onUpdateSettings({viewMode: v as OtpViewMode})}
                data={[
                    {
                        label: <Group spacing={"xs"}>
                            <IconTable size={20}/>
                            <Text inline>Table view</Text>
                        </Group>,
                        value: OtpViewMode.TABLE
                    },
                    {
                        label: <Group spacing={"xs"}>
                            <IconGridDots size={20}/>
                            <Text inline>Grid view</Text>
                        </Group>,
                        value: OtpViewMode.GRID
                    },
                ]}
            />

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
                    onChange={() => onUpdateSettings({showCodes: !showCodes})}
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
                            localStorage.removeItem(LOCAL_STORAGE_CACHED_PASSWORD_KEY);
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
