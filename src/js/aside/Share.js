import React, { useEffect, useState, useContext, forwardRef } from "react";
import {
  Text,
  Stack,
  MultiSelect,
  Group,
  Button,
  Avatar,
  PasswordInput,
  Divider,
  Card,
  ActionIcon,
  Flex,
  Loader,
  Center,
  ScrollArea,
  Box,
} from "@mantine/core";
import { IconShareOff, IconX, IconCheck, IconCopy } from "@tabler/icons-react";
import { DatePicker } from "@mantine/dates";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { useForm } from "@mantine/form";
import CryptoES from "crypto-es";
import moment from "moment";
import { copy } from "../utils/copy";

const SelectItem = forwardRef(({ image, label, value, ...others }, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      <Avatar src={image} radius="xl" />

      <div>
        <Text>{label == null ? value : label}</Text>
        <Text size="xs" color="dimmed">
          {value}
        </Text>
      </div>
    </Group>
  </div>
));

export default function AsideShare({ otp }) {
  const [activeShares, setActiveShares] = useState(null);
  const [users, setUsers] = useState([]);

  const [fetchUsers, setFetchUsers] = useState(true);
  const [fetchActiveShares, setFetchActiveShares] = useState(true);

  // const [userSetting, setUserSetting] = useContext(UserSettingContext);

  function showError(response) {
    updateNotification({
      id: "share-account",
      color: "red",
      title: "Error",
      message:
        response !== undefined && response.data["error"]
          ? response.data["error"]
          : "Something went wrong while sharing the account",
      icon: <IconX size={16} />,
      autoClose: 2000,
    });

    for (const field in response.data) {
      form.setFieldError(field, response.data[field]);
    }
  }

  async function saveShare(values) {
    showNotification({
      id: "share-account",
      loading: true,
      title: "Sharing account",
      message: "Account is being sharing",
      autoClose: false,
      disallowClose: true,
    });

    values.password = CryptoES.SHA256(values.plainTextPassword).toString();

    const key = CryptoES.enc.Hex.parse(values.password);
    const iv = CryptoES.lib.WordArray.random(16);

    values.iv = CryptoES.enc.Hex.stringify(iv);
    values.sharedSecret = CryptoES.AES.encrypt(otp.decryptedSecret, key, {
      iv: iv,
    }).toString();

    const response = await axios
      .post(generateUrl("/apps/otpmanager/share"), {
        data: values,
      })
      .catch(() => showError());

    if (response.data == "OK") {
      updateNotification({
        id: "share-account",
        color: "blue",
        title: "Account shared",
        message: (
          <>
            <Text>
              {otp.issuer != "" ? otp.issuer + " (" + otp.name + ")" : otp.name}{" "}
              shared with success.
            </Text>
            <Text fw={600}>
              Remember to share the password you used with the users you shared
              your account with.
            </Text>
            <Text td="underline" onClick={() => copy(values.plainTextPassword)}>
              Click here to copy the password.
            </Text>
          </>
        ),
        icon: (
          <ActionIcon color="blue" size="lg" radius="xl" variant="filled">
            <IconCopy
              size={26}
              onClick={() => copy(values.plainTextPassword)}
            />
          </ActionIcon>
        ),
        autoClose: false,
      });
      form.reset();
      setFetchUsers(true);
      setActiveShares(null);
      setFetchActiveShares(true);
    } else {
      showError(response);
    }
  }

  async function cancelShare(activeShareId, receiver) {
    showNotification({
      id: "delete-shared-account",
      loading: true,
      title: "Deleting shared account",
      message: "Sharing is being deleting",
      autoClose: false,
      disallowClose: true,
    });

    const response = await axios.delete(
      generateUrl(
        "/apps/otpmanager/share/" +
          activeShareId +
          "?receiver=" +
          receiver.value
      )
    );

    if (response.status === 200) {
      updateNotification({
        id: "delete-shared-account",
        color: "teal",
        title: "Shared account deleted",
        message:
          (otp.issuer != "" ? otp.issuer + " (" + otp.name + ")" : otp.name) +
          " is no longer shared with " +
          receiver.label,
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
    } else {
      updateNotification({
        id: "delete-shared-account",
        color: "red",
        title: "Error",
        message: "Something went wrong while deleting shared account",
        icon: <IconX size={16} />,
        autoClose: 2000,
      });
    }

    setActiveShares(null);
    setFetchActiveShares(true);
    setFetchUsers(true);
  }

  const form = useForm({
    initialValues: {
      users: [],
      expirationDate: null,
      plainTextPassword: "",
      accountSecret: otp.secret,
    },

    validate: {
      users: (value) =>
        value.length == 0 ? "Must choose at least one user" : null,
      plainTextPassword: (value) =>
        value.length == 0 ? "Password cannot be empty" : null,
    },
  });

  useEffect(() => {
    if (fetchUsers) {
      axios
        .get(generateUrl("/apps/otpmanager/get-users/" + otp.id))
        .then((response) => {
          setUsers(response.data);
          setFetchUsers(false);
        });
    }

    if (fetchActiveShares) {
      axios
        .get(generateUrl("/apps/otpmanager/share/" + otp.id))
        .then((response) => {
          setActiveShares(response.data);
          setFetchActiveShares(false);
        });
    }
  }, [fetchUsers, fetchActiveShares]);

  return (
    <>
      <form onSubmit={form.onSubmit((values) => saveShare(values))}>
        <Stack spacing="lg">
          <MultiSelect
            itemComponent={SelectItem}
            data={users}
            label="Share account to an other user"
            placeholder="Pick users"
            searchable
            nothingFound="Nothing found"
            clearButtonLabel="Clear selection"
            clearable
            maxDropdownHeight={200}
            transitionDuration={150}
            transition="pop"
            transitionTimingFunction="ease"
            limit={20}
            {...form.getInputProps("users")}
          />

          <DatePicker
            placeholder="Pick date"
            label="Choose an expiration date, if you want to share forever leave blank"
            transitionDuration={150}
            transition="pop"
            transitionTimingFunction="ease"
            minDate={new Date()}
            {...form.getInputProps("expirationDate")}
            onChange={(date) => {
              form.setValues({
                expirationDate: date == null ? null : moment(date).format("MM/DD/YYYY"),
              })
            }
            }
          />

          <PasswordInput
            label="Password"
            placeholder="Insert your sharing password"
            {...form.getInputProps("plainTextPassword")}
          />

          <Group position="right">
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </form>

      <Divider my="lg" />

      {fetchActiveShares ? (
        <Center h="100%">
          <Loader />
        </Center>
      ) : activeShares != null && activeShares.length > 0 ? (
        <>
          <Text mb="lg">Active shares</Text>

          <ScrollArea h="100%">
            {activeShares.map((activeShare) => {
              let receiver = activeShare.receiver;

              return (
                <Card
                  key={receiver.value}
                  mb="md"
                  shadow="md"
                  radius="md"
                  withBorder
                >
                  <Flex justify="space-between" align="center">
                    <div>
                      <Group>
                        <Avatar src={receiver.image} radius="xl" />
                        <Stack spacing="0">
                          <Text fw={700}>{receiver.label}</Text>
                          <>
                            <Group spacing="5px">
                              <Text fz="sm">{receiver.value}</Text>
                              <Text fz="sm">|</Text>
                              <Text fz="sm" fs="italic">
                                {activeShare.expired_at == null
                                  ? "Never expires"
                                  : `Expires on ${moment(
                                      activeShare.expired_at
                                    ).format("D MMMM YYYY")}`}
                              </Text>
                            </Group>
                          </>
                        </Stack>
                      </Group>
                    </div>
                    <ActionIcon
                      color="red"
                      onClick={(event) =>
                        cancelShare(activeShare.account_id, receiver)
                      }
                    >
                      <IconShareOff size={18} />
                    </ActionIcon>
                  </Flex>
                </Card>
              );
            })}
          </ScrollArea>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
