import React, { useContext, useState, useEffect } from "react";

import {
  Modal,
  Group,
  Button,
  Stack,
  Text,
  Box,
  FileInput,
  SegmentedControl,
  Center,
  PasswordInput,
} from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import {
  IconCheck,
  IconX,
  IconPlus,
  IconKey,
  IconFileExport,
  IconLock,
  IconLockOpen,
  IconFileImport,
} from "@tabler/icons-react";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { showNotification, updateNotification } from "@mantine/notifications";

export function ImportAccounts({ setAccounts, setFetchState, closeModal }) {
  const [file, setFile] = useState(null);

  const form = useForm({
    initialValues: {
      password: "",
    },

    /*validate: {
      oldPassword: (value) =>
        !isChanging || value.length !== 0
          ? null
          : "Old password cannot be empty",
      password: (value) =>
        strength == 100 ? null : "Not all requirements are satisfied",
      confirmPassword: (value, values) =>
        exists || value === values.password ? null : "Passwords did not match",
    },*/
  });

  function importAccounts() {
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      try {
        showNotification({
          id: "import-accounts",
          loading: true,
          title: "Import Accounts",
          message: "Accounts are being imported",
          autoClose: false,
          disallowClose: true,
        });

        axios
          .post(generateUrl("/apps/otpmanager/accounts/import"), {
            data: JSON.parse(fileReader.result),
            password: form.values.password,
          })
          .then((response) => {
            console.log(response.data);
            updateNotification({
              id: "import-accounts",
              color: "teal",
              title: "Import Accounts",
              message: "Accounts imported with success",
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
                console.log("400");
                updateNotification({
                  id: "import-accounts",
                  color: "red",
                  title: "Request Error",
                  message: error.response.data["error"],
                  icon: <IconX size={16} />,
                  autoClose: 2000,
                });
              }
            } else if (error.request) {
              updateNotification({
                id: "import-accounts",
                color: "red",
                title: "Timeout Error",
                message: "The nextcloud server took too long to respond",
                icon: <IconX size={16} />,
                autoClose: 2000,
              });
            } else {
              console.log(error);
              updateNotification({
                id: "import-accounts",
                color: "red",
                title: "Generic Error",
                message: "Something went wrong",
                icon: <IconX size={16} />,
                autoClose: 2000,
              });
            }
          });
      } catch (e) {
        showNotification({
          id: "import-accounts",
          title: "Import Error",
          message: "The file uploaded is not a .json file",
          color: "red",
          icon: <IconX size={16} />,
          autoClose: 2000,
        });
      }
    };

    if (file != null) fileReader.readAsText(file);
  }

  return (
    <>
      <FileInput
        label="Import file"
        placeholder="Click here to upload your .json file"
        accept="application/json"
        value={file}
        onChange={setFile}
      />

      <PasswordInput
        label="Password"
        mb="md"
        description="Only if you are importing encrypted accounts"
        placeholder="Insert the password to decrypt"
        {...form.getInputProps("password")}
      />

      <Group position="right">
        <Button
          styles={{
            icon: {
              display: "inline",
            },
          }}
          rightIcon={<IconFileImport />}
          type="submit"
          onClick={() => importAccounts()}
        >
          Import accounts
        </Button>
      </Group>
    </>
  );
}
