import React, { useContext } from "react";

import { Button, Group, Modal, Stack } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { IconCheck, IconKey, IconX } from "@tabler/icons-react";
import CryptoES from "crypto-es";
import PasswordForm from "./../utils/PasswordForm";
import { SecretContext } from "./../context/SecretProvider";

export function ChangePassword({
  showChangePassword,
  setShowChangePassword,
  setAccounts,
  setFetchState,
}) {
  const [secret, setSecret] = useContext(SecretContext);

  function closeModal() {
    setShowChangePassword(false);
  }

  async function changePassword(values) {
    showNotification({
      id: "change-password",
      loading: true,
      title: "Password",
      message: "Password is being updated",
      autoClose: false,
      disallowClose: true,
    });

    axios
      .put(generateUrl("/apps/otpmanager/password"), {
        newPassword: values.password,
        oldPassword: values.oldPassword,
      })
      .then((response) => {
        updateNotification({
          id: "change-password",
          color: "teal",
          title: "Password",
          message: "Password updated with success",
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });
        setSecret(
          secret.copyWith({
            iv: response.data["iv"],
            password: values.password,
            passwordHash: CryptoES.SHA256(values.password).toString(),
          })
        );
        if (localStorage.getItem("otpmanager_cached_password") !== null) {
          localStorage.setItem("otpmanager_cached_password", values.password);
        }
        closeModal();
        setAccounts(null);
        setFetchState(true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 400) {
            updateNotification({
              id: "change-password",
              color: "red",
              title: "Request Error",
              message: error.response.data["error"],
              icon: <IconX size={16} />,
              autoClose: 2000,
            });
          }
        } else if (error.request) {
          updateNotification({
            id: "change-password",
            color: "red",
            title: "Timeout Error",
            message: "The nextcloud server took too long to respond",
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        } else {
          updateNotification({
            id: "change-password",
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
    <Modal
      opened={showChangePassword}
      onClose={() => closeModal()}
      title="Change Password"
      centered
    >
      <Stack spacing="xl">
        <PasswordForm
          exists={false}
          onSubmit={changePassword}
          isChanging={true}
        />

        <Group position="right">
          <Button
            styles={{
              icon: {
                display: "inline",
              },
            }}
            rightIcon={<IconKey />}
            type="submit"
            form="form"
          >
            Change Password
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
