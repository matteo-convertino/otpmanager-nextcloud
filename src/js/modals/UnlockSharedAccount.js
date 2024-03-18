import React, { useContext } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Modal, Stack, PasswordInput, Flex } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { IconCheck, IconKey, IconX } from "@tabler/icons-react";
import CryptoES from "crypto-es";
import PasswordForm from "./../utils/PasswordForm";
import { SecretContext } from "./../context/SecretProvider";
import { useForm, isNotEmpty } from "@mantine/form";

export function UnlockSharedAccount({
  sharedAccountToUnlock,
  setSharedAccountToUnlock,
  setAccounts,
  setFetchState,
}) {
  const [secret, setSecret] = useContext(SecretContext);
  const [visible, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      tempPassword: "",
    },

    validate: {
      tempPassword: isNotEmpty("Password cannot be empty"),
    },
  });

  function closeModal() {
    setSharedAccountToUnlock(null);
  }

  async function unlock(values) {
    showNotification({
      id: "unlock",
      loading: true,
      title: "Shared Account",
      message: "Unlocking shared account",
      autoClose: false,
      disallowClose: true,
    });

    axios
      .post(generateUrl("/apps/otpmanager/share/unlock"), {
        accountId: sharedAccountToUnlock.account_id,
        currentPassword: secret.passwordHash,
        tempPassword: values.tempPassword,
      })
      .then((response) => {
        updateNotification({
          id: "unlock",
          color: "teal",
          title: "Shared Account",
          message: "Shared account unlocked with success",
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });
        closeModal();
        setAccounts(null);
        setFetchState(true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 400) {
            updateNotification({
              id: "unlock",
              color: "red",
              title: "Request Error",
              message: error.response.data["error"],
              icon: <IconX size={16} />,
              autoClose: 2000,
            });
          }
        } else if (error.request) {
          updateNotification({
            id: "unlock",
            color: "red",
            title: "Timeout Error",
            message: "The nextcloud server took too long to respond",
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        } else {
          updateNotification({
            id: "unlock",
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
      opened={sharedAccountToUnlock !== null}
      onClose={() => closeModal()}
      title="Unlock Shared Account"
      centered
    >
      <form onSubmit={form.onSubmit((values) => unlock(values))}>
        <Stack spacing="xl">
          <PasswordInput
            label="Password"
            description="Insert the password that was used to share this account"
            visible={visible}
            onVisibilityChange={toggle}
            {...form.getInputProps("tempPassword")}
          />

          <Flex justify="flex-end">
            <Button type="submit">Unlock</Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
}
