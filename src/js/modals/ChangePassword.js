import React, { useContext } from "react";

import { Modal, Group, Button, Stack } from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import { IconCheck, IconX, IconPlus, IconKey } from "@tabler/icons-react";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import PasswordForm from "./../utils/PasswordForm";
import { UserSettingContext } from "./../utils/UserSettingProvider";
import CryptoES from "crypto-es";

export function ChangePassword({
  showChangePassword,
  setShowChangePassword,
  setAccounts,
  setFetchState,
}) {
  const [userSetting, setUserSetting] = useContext(UserSettingContext);

  function closeModal() {
    setShowChangePassword(false);
    //form.reset();
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
        setUserSetting(
          userSetting.copyWith({
            iv: response.data["iv"],
            password: CryptoES.SHA256(values.password).toString(),
          })
        );
        console.log("Aaa");
        console.log(response.data["iv"]);
        closeModal();
        setAccounts(null);
        setFetchState(true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 400) {
            console.log("400");
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
          console.log(error);
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
