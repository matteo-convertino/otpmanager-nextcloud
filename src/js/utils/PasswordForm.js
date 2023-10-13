import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";

import {
  MantineProvider,
  createEmotionCache,
  Loader,
  Center,
  AppShell,
  Group,
  Text,
  Popover,
  PasswordInput,
  Progress,
  Flex,
  Box,
  Button,
  Card,
  Divider,
  Stack,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  NotificationsProvider,
  cleanNotifications,
  showNotification,
  updateNotification,
} from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { ModalsProvider } from "@mantine/modals";
import { useForm } from "@mantine/form";

function PasswordRequirement({ meets, label }) {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <IconCheck style={{ width: 14, height: 14 }} />
      ) : (
        <IconX style={{ width: 14, height: 14 }} />
      )}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /^.{6,}$/, label: "Length greater than 5 character" },
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default function PasswordForm({ exists, onSubmit, isChanging }) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [visible, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      oldPassword: (value) =>
        !isChanging || value.length !== 0
          ? null
          : "Old password cannot be empty",
      password: (value) =>
        strength == 100 ? null : "Not all requirements are satisfied",
      confirmPassword: (value, values) =>
        exists || value === values.password ? null : "Passwords did not match",
    },
  });

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));
  const strength = getStrength(form.values.password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  return (
    <Box>
      <form id="form" onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <Flex justify="center" direction="column">
          <Popover
            opened={popoverOpened}
            disabled={exists}
            position="bottom"
            width="calc(100% - 68px)"
            shadow="md"
          >
            {isChanging && (
              <PasswordInput
                required
                label="Current Password"
                mb="md"
                placeholder="Insert your current password"
                //value={form.values.oldPassword}
                /*onChange={(event) =>
                      event.target.value.length <= 6 &&
                      form.setFieldValue("oldPassword", event.target.value)
                    }*/
                {...form.getInputProps("oldPassword")}
                //visible={visible}
                //onVisibilityChange={toggle}
              />
            )}
            <Popover.Target>
              <Box
                w="100%"
                onFocusCapture={() => setPopoverOpened(true)}
                onBlurCapture={() => setPopoverOpened(false)}
              >
                <PasswordInput
                  required
                  label="Password"
                  placeholder={
                    "Insert your" + (isChanging ? " new " : " ") + "password"
                  }
                  //value={form.values.password}
                  /*onChange={(event) =>
                    event.target.value.length <= 6 &&
                    form.setFieldValue("password", event.target.value)
                  }*/
                  visible={visible}
                  onVisibilityChange={toggle}
                  {...form.getInputProps("password")}
                />
              </Box>
            </Popover.Target>
            <Popover.Dropdown>
              <Progress color={color} value={strength} size={5} mb="xs" />
              {/*<PasswordRequirement
                label="Must contains 6 characters"
                meets={form.values.password.length == 6}
                />*/}
              {checks}
            </Popover.Dropdown>
          </Popover>
          {!exists && (
            <PasswordInput
              required
              label="Confirm Password"
              placeholder={
                "Confirm your" + (isChanging ? " new " : " ") + "password"
              }
              //value={form.values.confirmPassword}
              mt="md"
              /*onChange={(event) =>
                event.target.value.length <= 6 &&
                form.setFieldValue("confirmPassword", event.target.value)
              }*/
              visible={visible}
              onVisibilityChange={toggle}
              {...form.getInputProps("confirmPassword")}
            />
          )}
        </Flex>
      </form>
    </Box>
  );
}
