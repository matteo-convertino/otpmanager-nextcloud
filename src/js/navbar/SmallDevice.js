import React, { useState } from "react";

import {
  Text,
  Drawer,
  Stack,
  Group,
  Collapse,
  Checkbox,
  Box,
} from "@mantine/core";
import {
  IconList,
  IconApps,
  IconChevronRight,
  IconChevronLeft,
  IconSettings,
} from "@tabler/icons-react";
import { navbarStyles } from "./Styles";

export function NavbarSmallDevice({
  showNavbarSmallDevice,
  setShowNavbarSmallDevice,
  showSettings,
  setShowSettings,
  showCodes,
  setShowCodes,
  setShowApps,
}) {
  const [active, setActive] = useState("All accounts");
  const { classes, cx } = navbarStyles();
  const ChevronIcon = !showSettings ? IconChevronRight : IconChevronLeft;

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
                checked={showCodes}
                onChange={(e) => setShowCodes((o) => !o)}
                className={classes.innerLink}
                label="Show codes"
              />
            </Collapse>
          </div>
        </Stack>
      </Drawer>
    </>
  );
}
