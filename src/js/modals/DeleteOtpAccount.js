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

    const response = await axios.delete(
      generateUrl("/apps/otpmanager/accounts/" + account.id)
    );
    if (response.data == "OK") {
      updateNotification({
        id: "delete-account",
        color: "teal",
        title: "Account deleted",
        message:
          account.issuer + " (" + account.name + ") deleted with success",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
    } else {
      updateNotification({
        id: "delete-account",
        color: "red",
        title: "Error",
        message: "Something went wrong while deleting the account",
        icon: <IconX size={16} />,
        autoClose: 2000,
      });
    }

    setPage(1);
    setAccounts(null);
    setFetchState(true);
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
