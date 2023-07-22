import React, { useEffect } from "react";

import { Modal } from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import { IconCheck, IconX, IconEdit } from "@tabler/icons-react";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { showNotification, updateNotification } from "@mantine/notifications";
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

  useEffect(() => {
    if (otp != null) {
      form.setFieldValue("name", otp.name);
      form.setFieldValue("issuer", otp.issuer);
      form.setFieldValue("secret", otp.secret);
      form.setFieldValue("type", otp.type);
      form.setFieldValue("period", otp.period.toString());
      form.setFieldValue("algorithm", getAlgorithm(otp.algorithm));
      form.setFieldValue("digits", otp.digits.toString());
    }
  }, [otp]);

  // prevent that modal crash when otp is null (first page load)
  if (otp == null) {
    return (
      <Modal
        opened={showEditOtpAccount}
        onClose={() => setShowEditOtpAccount(false)}
        title={"Edit Account "}
      ></Modal>
    );
  }

  async function editAccount(values) {
    showNotification({
      id: "edit-account",
      loading: true,
      title: "Editing account",
      message: "Account is being editing",
      autoClose: false,
      disallowClose: true,
    });

    const response = await axios.put(generateUrl("/apps/otpmanager/accounts"), {
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
      <form onSubmit={form.onSubmit((values) => editAccount(values))}>
        <ModalContent
          form={form}
          textSubmitButton="Edit"
          iconSumbitButton={<IconEdit size="18px" />}
          isSecretKeyDisabled={true}
        />
      </form>
    </Modal>
  );
}
