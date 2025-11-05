import React, { useContext } from "react";

import { Modal } from "@mantine/core";
import { hasLength, useForm, matches } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { SecretContext } from "./../context/SecretProvider";
import ModalContent from "./CreateEditContent";
import {AES, Hex} from "crypto-es";

export function CreateOtpAccount({
  showCreateAccount,
  setShowCreateAccount,
  setAccounts,
  setFetchState,
}) {
  const [secretContext, setSecretContext] = useContext(SecretContext);

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
      name: hasLength(
        { min: 1, max: 256 },
        "Name must be 1-256 characters long"
      ),
      issuer: hasLength(
        { min: 0, max: 256 },
        "Issuer must be shorter than 256 characters"
      ),
      secret: (value) => {
        if (value.length < 16 || value.length > 512) {
          return "Secret must be 16-512 characters long";
        }

        if (!value.match(/^[A-Z2-7]+=*$/i)) {
          return "Secret key is not Base32-encodable";
        }

        return null;
      },
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

    const key = Hex.parse(secretContext.passwordHash);
    const parsedIv = Hex.parse(secretContext.iv);
    values.secret = AES.encrypt(values.secret, key, {
      iv: parsedIv,
    }).toString();

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
      <form
        onSubmit={form.onSubmit((values) =>
          createAccount(JSON.parse(JSON.stringify(values)))
        )}
      >
        <ModalContent
          form={form}
          textSubmitButton="Add"
          iconSumbitButton={<IconPlus size="18px" />}
          isSecretKeyDisabled={false}
          isSharedAccount={false}
        />
      </form>
    </Modal>
  );
}
