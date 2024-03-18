import React, { useEffect } from "react";

import { Modal } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { IconCheck, IconEdit, IconX } from "@tabler/icons-react";
import { getAlgorithm } from "../utils/getAlgorithm";
import ModalContent from "./CreateEditContent";

export function EditOtpAccount({
  otp,
  showEditOtpAccount,
  setShowEditOtpAccount,
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
      name: hasLength(
        { min: 1, max: 256 },
        "Name must be 1-256 characters long"
      ),
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

  useEffect(() => {
    if (otp != null) {
      form.setFieldValue("name", otp.name);
      form.setFieldValue("issuer", otp.issuer);
      form.setFieldValue("secret", otp.decryptedSecret);
      form.setFieldValue("type", otp.type);
      form.setFieldValue("period", otp.period.toString());
      form.setFieldValue("algorithm", getAlgorithm(otp.algorithm));
      form.setFieldValue("digits", otp.digits.toString());
    }
  }, [otp]);

  async function editAccount(values) {
    showNotification({
      id: "edit-account",
      loading: true,
      title: "Editing account",
      message: "Account is being editing",
      autoClose: false,
      disallowClose: true,
    });

    values.secret = otp.secret;

    const url =
      otp.unlocked === undefined
        ? "/apps/otpmanager/accounts"
        : "/apps/otpmanager/share";

    const response = await axios.put(generateUrl(url), {
      data: values,
    });

    if (response.data == "OK") {
      updateNotification({
        id: "edit-account",
        color: "teal",
        title: "Account edited",
        message:
          (values.issuer != ""
            ? values.issuer + " (" + values.name + ")"
            : values.name) + " edited with success",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      setShowEditOtpAccount(false);
      setAccounts(null);
      setFetchState(true);
    } else {
      var msg = "Something went wrong while editing the account";

      if (response.data.msg !== undefined) {
        msg = response.data.msg;
        delete response.data.msg;
      }

      updateNotification({
        id: "edit-account",
        color: "red",
        title: "Error",
        message: msg,
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
      opened={showEditOtpAccount}
      onClose={() => setShowEditOtpAccount(false)}
      title="Edit Account"
    >
      <form
        onSubmit={form.onSubmit((values) =>
          editAccount(JSON.parse(JSON.stringify(values)))
        )}
      >
        <ModalContent
          form={form}
          textSubmitButton="Edit"
          iconSumbitButton={<IconEdit size="18px" />}
          isSecretKeyDisabled={true}
          isSharedAccount={otp != null && otp.unlocked !== undefined}
        />
      </form>
    </Modal>
  );
}
