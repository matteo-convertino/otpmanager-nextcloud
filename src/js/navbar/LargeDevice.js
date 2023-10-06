import React, { useState, useContext } from "react";

import {
  Navbar,
  Text,
  Checkbox,
  Group,
  Collapse,
  Box,
  ActionIcon,
  Flex,
} from "@mantine/core";
import {
  IconList,
  IconApps,
  IconSettings,
  IconChevronRight,
  IconChevronLeft,
  IconSun,
  IconMoonStars,
} from "@tabler/icons-react";
import { navbarStyles } from "./Styles";
import { UserSettingContext } from "./../utils/UserSettingProvider";

export function NavbarLargeDevice({
  showSettings,
  setShowSettings,
  setShowApps,
}) {
  const [active, setActive] = useState("All accounts");
  const { classes, cx } = navbarStyles();
  const ChevronIcon = !showSettings ? IconChevronRight : IconChevronLeft;
  const [userSetting, setUserSetting] = useContext(UserSettingContext);

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
              checked={userSetting.showCodes}
              onChange={(e) => setUserSetting(
                userSetting.copyWith({ showCodes: !userSetting.showCodes })
              )}
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
                sx={{ width: "20px", height: "20px", minWidth: "20px", minHeight: "20px" }}
                title="Toggle color scheme"
              >
                {userSetting.darkMode ? (
                  <IconSun style={{ width: 16 }} />
                ) : (
                  <IconMoonStars style={{ width: 16 }} />
                )}
              </ActionIcon>
              <Text
                sx={{ fontSize: "14px", color: "#C1C2C5", marginLeft: "12px" }}
              >
                {"Switch to " +
                  (userSetting.darkMode ? "light mode" : "dark mode")}
              </Text>
            </Flex>
          </Collapse>
        </Navbar.Section>
      </Navbar>
    </>
  );
}
