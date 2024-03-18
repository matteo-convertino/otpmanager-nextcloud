import React, { useContext, useState } from "react";

import {
  ActionIcon,
  Box,
  Checkbox,
  Collapse,
  Drawer,
  Flex,
  Group,
  Stack,
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
import { UserSettingContext } from "./../context/UserSettingProvider";
import { navbarStyles } from "./Styles";

export function NavbarSmallDevice({
  showNavbarSmallDevice,
  setShowNavbarSmallDevice,
  showSettings,
  setShowSettings,
  setShowApps,
  setShowChangePassword,
  setShowImportExport,
}) {
  const [active, setActive] = useState("All accounts");
  const { classes, cx } = navbarStyles();
  const ChevronIcon = !showSettings ? IconChevronRight : IconChevronLeft;
  const [userSetting, setUserSetting] = useContext(UserSettingContext);
  const [passwordSaved, setPasswordSaved] = useState(
    Boolean(localStorage.getItem("otpmanager_cached_password"))
  );

  return (
    <>
      <Drawer
        padding="xs"
        position="left"
        size={300}
        opened={showNavbarSmallDevice}
        onClose={() => setShowNavbarSmallDevice(false)}
        title={
          <Text fw={700} fz="lg" ta="center">
            OTP Manager
          </Text>
        }
        styles={{
          drawer: {
            top: "50px",
            //minHeight: "calc(100vh - 50px)"
          },
          header: classes.header,
          body: {
            height: "calc(100% - 100px)",
          },
          closeButton: {
            position: "absolute",
            left: "calc(100% - 28px - 16px);", // - 28px (button size) - 16 px (padding right)
          },
          title: {
            width: "100%",
          },
        }}
      >
        <Stack sx={{ height: "calc(100% + 20px)" }} justify="space-between">
          <div>
            <a
              className={cx(classes.link, {
                [classes.linkActive]: "All accounts" === active,
              })}
            >
              <IconList className={classes.linkIcon} stroke={1.5} />
              <span>All accounts</span>
            </a>
          </div>

          <div className={classes.footer}>
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
                checked={userSetting.showCodes}
                onChange={(e) =>
                  setUserSetting(
                    userSetting.copyWith({ showCodes: !userSetting.showCodes })
                  )
                }
                className={classes.innerLink}
                label="Show codes"
              />
              <Flex className={classes.innerLink} align="center">
                <ActionIcon
                  variant="outline"
                  color={userSetting.darkMode ? "yellow" : "blue"}
                  onClick={() =>
                    setUserSetting(
                      userSetting.copyWith({ darkMode: !userSetting.darkMode })
                    )
                  }
                  sx={{
                    width: "20px",
                    height: "20px",
                    minWidth: "20px",
                    minHeight: "20px",
                  }}
                  title="Toggle color scheme"
                >
                  {userSetting.darkMode ? (
                    <IconSun style={{ width: 16 }} />
                  ) : (
                    <IconMoonStars style={{ width: 16 }} />
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
                    (userSetting.darkMode ? "light mode" : "dark mode")}
                </Text>
              </Flex>

              <Flex className={classes.innerLink} align="center">
                <ActionIcon
                  variant="outline"
                  color="red"
                  onClick={(e) => {
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
          </div>
        </Stack>
      </Drawer>
    </>
  );
}
