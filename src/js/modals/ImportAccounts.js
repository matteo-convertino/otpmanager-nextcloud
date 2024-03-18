import React, { useState, useContext } from "react";

import {
  Button,
  FileInput,
  Group,
  PasswordInput,
  Alert,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import {
  IconCheck,
  IconFileImport,
  IconX,
  IconInfoCircle,
} from "@tabler/icons-react";
import { SecretContext } from "./../context/SecretProvider";

export function ImportAccounts({ setAccounts, setFetchState, closeModal }) {
  const [file, setFile] = useState(null);
  const [secret, setSecret] = useContext(SecretContext);

  const form = useForm({
    initialValues: {
      password: "",
    },
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
            passwordUsedOnExport: form.values.password,
            currentPassword: secret.passwordHash,
          })
          .then((response) => {
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
      {/*<Alert
        variant="light"
        color="blue"
        radius="md"
        title="Other way to import"
        icon={<IconInfoCircle />}
      >
        If you're using FreeOTP and you want to import your accounts here, take
        a look at{" "}
        <Anchor href="https://github.com/betabrandao/utils/blob/main/filecopys/freeotp2nextcloudotp.py" target="_blank">
          this script
        </Anchor>
        .
      </Alert>*/}

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
