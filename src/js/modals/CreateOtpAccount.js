import React from "react";

import { Modal } from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import { IconCheck, IconX, IconPlus } from "@tabler/icons-react";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import ModalContent from "./CreateEditContent";

export function CreateOtpAccount({
  showCreateAccount,
  setShowCreateAccount,
  setAccounts,
  setFetchState,
}) {
  const form = useForm({
    initialValues: {
      name: "",
      issuer: "",
      secret: "",
      type: "totp",
      period: "30",
      algorithm: "SHA1",
      digits: "6",
    },

    validate: {
      name: hasLength({ min: 1, max: 64 }, "Name must be 1-64 characters long"),
      issuer: hasLength(
        { min: 0, max: 64 },
        "Issuer must be shorter than 64 characters"
      ),
      secret: hasLength(
        { min: 1, max: 256 },
        "Secret must be 1-256 characters long"
      ),
    },
  });

  function closeModal() {
    setShowCreateAccount(false);
    form.reset();
  }

  async function createAccount(values) {
    showNotification({
      id: "create-account",
      loading: true,
      title: "Creating account",
      message: "Account is being creating",
      autoClose: false,
      disallowClose: true,
    });

    const response = await axios.post(
      generateUrl("/apps/otpmanager/accounts"),
      { data: values }
    );

    if (response.data == "OK") {
      updateNotification({
        id: "create-account",
        color: "teal",
        title: "Account created",
        message:
          (values.issuer != ""
            ? values.issuer + " (" + values.name + ")"
            : values.name) + " created with success",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      closeModal();
      setAccounts(null);
      setFetchState(true);
    } else {
      updateNotification({
        id: "create-account",
        color: "red",
        title: "Error",
        message: "Something went wrong while creating the account",
        icon: <IconX size={16} />,
        autoClose: 2000,
      });

      for (const field in response.data) {
        form.setFieldError(field, response.data[field]);
      }
    }
  }

  return (
    <Modal
      opened={showCreateAccount}
      onClose={() => closeModal()}
      title="Add New Account"
    >
      <form onSubmit={form.onSubmit((values) => createAccount(values))}>
        <ModalContent
          form={form}
          textSubmitButton="Add"
          iconSumbitButton={<IconPlus size="18px" />}
          isSecretKeyDisabled={false}
        />
      </form>
    </Modal>
  );
}
