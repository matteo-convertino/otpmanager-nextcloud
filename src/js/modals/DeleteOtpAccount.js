import React from "react";

import { Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { IconX, IconCheck } from "@tabler/icons-react";

export function openDeleteModal(account, setAccounts, setFetchState, setPage) {
  async function deleteAccount() {
    showNotification({
      id: "delete-account",
      loading: true,
      title: "Deleting account",
      message: account.issuer + " (" + account.name + ") is being deleted",
      autoClose: false,
      disallowClose: true,
    });

    const url =
      account.unlocked === undefined
        ? "/apps/otpmanager/accounts/" + account.id
        : "/apps/otpmanager/share/" + account.account_id;

    axios
      .delete(generateUrl(url))
      .then((response) => {
        updateNotification({
          id: "delete-account",
          color: "teal",
          title: "Account deleted",
          message:
            (account.issuer != ""
              ? account.issuer + " (" + account.name + ")"
              : account.name) + " deleted with success",
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        })
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 400) {
            updateNotification({
              id: "delete-account",
              color: "red",
              title: "Request Error",
              message: error.response.data["error"],
              icon: <IconX size={16} />,
              autoClose: 2000,
            });
          }
        } else if (error.request) {
          updateNotification({
            id: "delete-account",
            color: "red",
            title: "Timeout Error",
            message: "The nextcloud server took too long to respond",
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        } else {
          updateNotification({
            id: "delete-account",
            color: "red",
            title: "Generic Error",
            message: "Something went wrong",
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        }
      }).finally(() => {
        setPage(1);
        setAccounts(null);
        setFetchState(true);
      });
  }

  return openConfirmModal({
    title: "Delete Account",
    centered: true,
    children: (
      <Text size="sm">
        Are you sure that you want to remove{" "}
        {account.issuer != ""
          ? account.issuer + " (" + account.name + ")"
          : account.name}
        ?
      </Text>
    ),
    labels: { confirm: "Delete", cancel: "Cancel" },
    confirmProps: { color: "red" },
    //onCancel: () => console.log('Cancel'),
    onConfirm: () => deleteAccount(),
  });
}
