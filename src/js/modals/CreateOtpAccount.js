import React, { useContext } from "react";

import { Modal } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import CryptoES from "crypto-es";
import { UserSettingContext } from "./../utils/UserSettingProvider";
import ModalContent from "./CreateEditContent";

export function CreateOtpAccount({
  showCreateAccount,
  setShowCreateAccount,
  setAccounts,
  setFetchState,
}) {
  const [userSetting, setUserSetting] = useContext(UserSettingContext);

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
      name: hasLength({ min: 1, max: 256 }, "Name must be 1-256 characters long"),
      issuer: hasLength(
        { min: 0, max: 256 },
        "Issuer must be shorter than 256 characters"
      ),
      secret: hasLength(
        { min: 1, max: 512 },
        "Secret must be 1-512 characters long"
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

    const key = CryptoES.enc.Hex.parse(userSetting.password);
    const parsedIv = CryptoES.enc.Hex.parse(userSetting.iv);
    const encryptedSecret = CryptoES.AES.encrypt(values.secret, key, {
      iv: parsedIv,
    });

    values.secret = encryptedSecret.toString();

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
      <form onSubmit={form.onSubmit((values) => createAccount(JSON.parse(JSON.stringify(values))))}>
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
