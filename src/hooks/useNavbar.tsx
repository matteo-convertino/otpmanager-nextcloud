import {useState} from "react";

import {Box, Button, Checkbox, Collapse, Group, SegmentedControl, Stack, Text} from "@mantine/core";
import {
    IconApps,
    IconBrandApple,
    IconBulb,
    IconChevronLeft,
    IconChevronRight,
    IconEye,
    IconFileInvoice,
    IconGridDots,
    IconKey,
    IconList,
    IconLockOff,
    IconSettings,
    IconTable,
    IconTrash,
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
import {useNavbarPageStore} from "@/context/useNavbarPageStore.ts";
import {NavbarPage} from "@/utils/enum/navbarPage.ts";
import {useAccountsStore} from "@/context/useAccountsStore.ts";


export function useNavbar() {
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
    const {activePage, setActivePage} = useNavbarPageStore();
    const {setAccounts, setIsFetching} = useAccountsStore();

    const {lottieRef: birdWavingLottieRef, onDOMLoaded: onBirdWavingLottieLoaded} = useLottie(0.5);

    const header = (
        <Text fw={700} fz="lg" ta="center">
            OTP Manager
        </Text>
    );

    const onChangePage = (page: NavbarPage) => {
        if (page === activePage) return;

        setActivePage(page);
        setAccounts(undefined);
        setIsFetching(true);
    };

    const body = (
        <Stack spacing={"sm"}>
            <a
                className={cx(classes.link, {
                    [classes.linkActive]: NavbarPage.ALL === activePage,
                })}
                onClick={() => onChangePage(NavbarPage.ALL)}
            >
                <IconList className={classes.linkIcon} stroke={1.5}/>
                <Text>{NavbarPage.ALL}</Text>
            </a>

            <a
                className={cx(classes.link, {
                    [classes.linkActive]: NavbarPage.TRASH === activePage,
                })}
                onClick={() => onChangePage(NavbarPage.TRASH)}
            >
                <IconTrash className={classes.linkIcon} stroke={1.5}/>
                <Text>{NavbarPage.TRASH}</Text>
            </a>
        </Stack>
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
                <Text>Apps</Text>
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
                    size={"md"}
                    className={classes.innerLink}
                    icon={IconEye}
                    checked={showCodes}
                    onChange={() => onUpdateSettings({showCodes: !showCodes})}
                    label={<Text fz={"sm"}>Show codes</Text>}
                    disabled={isFetchingSettings}
                />
                <Checkbox
                    size={"md"}
                    className={classes.innerLink}
                    icon={IconBulb}
                    color={"yellow"}
                    label={<Text fz={"sm"}>{"Switch to " + (darkMode ? "light mode" : "dark mode")}</Text>}
                    checked={!darkMode}
                    onClick={() => onUpdateSettings({darkMode: !darkMode})}
                    disabled={isFetchingSettings}
                />
                <Checkbox
                    size={"md"}
                    className={classes.innerLink}
                    icon={IconLockOff}
                    label={<Text fz={"sm"}>Remove saved password</Text>}
                    color={"red"}
                    indeterminate
                    defaultChecked={passwordSaved}
                    onClick={() => {
                        localStorage.removeItem(LOCAL_STORAGE_CACHED_PASSWORD_KEY);
                        setPasswordSaved(false);
                    }}
                    disabled={!passwordSaved}
                />

                <div
                    className={classes.link}
                    onClick={() => setShowChangePassword(true)}
                >
                    <IconKey className={classes.linkIcon}/>
                    <Text>Change password</Text>
                </div>
                <div
                    className={classes.link}
                    onClick={() => setShowImportExport(true)}
                >
                    <IconFileInvoice className={classes.linkIcon}/>
                    <Text>Import / Export</Text>
                </div>
            </Collapse>
        </div>
    );

    return {header, body, footer};
}
