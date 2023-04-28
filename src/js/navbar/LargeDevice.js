import React, { useState } from "react";

import { Navbar, Text, Checkbox, Group, Collapse, Box } from "@mantine/core";
import {
  IconList,
  IconApps,
  IconSettings,
  IconChevronRight,
  IconChevronLeft,
} from "@tabler/icons-react";
import { navbarStyles } from "./Styles";

export function NavbarLargeDevice({
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
              onChange={(e) => setShowCodes((o) => !o)}
              className={classes.innerLink}
              label="Show codes"
            />
          </Collapse>
        </Navbar.Section>
      </Navbar>
    </>
  );
}
