import React, { useState, useEffect, useContext } from "react";
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
import { UserSettingContext } from "./utils/UserSettingProvider";
import CryptoES from "crypto-es";
import PasswordForm from "./utils/PasswordForm"

export const Password = ({ exists, setAuth }) => {
  const [userSetting, setUserSetting] = useContext(UserSettingContext);

  function updatePassword(values) {
    showNotification({
      id: "update-password",
      loading: true,
      title: "Password",
      message: exists
        ? "Password is being checked"
        : "Password is being stored",
      autoClose: false,
      disallowClose: true,
    });

    axios
      .post(
        generateUrl(
          exists
            ? "/apps/otpmanager/password/check"
            : "/apps/otpmanager/password"
        ),
        {
          password: values.password,
        }
      )
      .then((response) => {
        updateNotification({
          id: "update-password",
          color: "teal",
          title: "Password",
          message: exists ? "Correct password" : "Password stored with success",
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });
        setAuth(true);
        setUserSetting(
          userSetting.copyWith({
            iv: response.data["iv"],
            password: CryptoES.SHA256(values.password).toString(),
          })
        );
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 400) {
            console.log("400");
            updateNotification({
              id: "update-password",
              color: "red",
              title: "Request Error",
              message: error.response.data["error"],
              icon: <IconX size={16} />,
              autoClose: 2000,
            });
          }
        } else if (error.request) {
          updateNotification({
            id: "update-password",
            color: "red",
            title: "Timeout Error",
            message: "The nextcloud server took too long to respond",
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        } else {
          console.log(error);
          updateNotification({
            id: "update-password",
            color: "red",
            title: "Generic Error",
            message: "Something went wrong",
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        }
      });
  }

  return (
    <AppShell
      padding="0"
      fixed={false}
      layout="alt"
      /*styles={{
      main: {
        width: smallScreen ? "100vw" : "calc(100vw - 300px)",
      },
    }}*/
    >
      <Flex
        justify="center"
        align="center"
        sx={(theme) => ({
          background:
            theme.colorScheme === "dark"
              ? "rgba(0, 0, 0, .8)"
              : "rgba(255, 255, 255, .8)",
          padding: "16px",
          paddingBottom: "calc(var(--body-container-margin)*2 + 16px)",
          paddingRight: "calc(var(--body-container-margin)*2 + 16px)",
          height: "calc(100vh - 44px - 50px)",
        })}
      >
        {exists == null ? (
          <Loader />
        ) : (
          <Card w={500} h={500} shadow="xl" padding="lg" radius="lg" withBorder>
            <Stack justify="space-between" h="100%">
              <Box>
                <Text size="lg" fw={700} ta="center">
                  Authentication
                </Text>
                <Divider my="sm" />
              </Box>

              <PasswordForm exists={exists} onSubmit={updatePassword} />

              <Box>
                <Divider my="md" />
                <Flex justify="flex-end">
                  <Button
                    type="submit"
                    form="form"
                  >
                    Submit
                  </Button>
                </Flex>
              </Box>
            </Stack>
          </Card>
        )}
      </Flex>
    </AppShell>
  );
};
