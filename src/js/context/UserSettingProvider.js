import { showNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { IconX } from "@tabler/icons-react";
import React, { createContext, useEffect, useState } from "react";
import { UserSetting } from "../model/UserSetting";

const initState = new UserSetting(false, null, "10");

const UserSettingContext = createContext(initState);

const UserSettingContextProvider = ({ children }) => {
  const [state, setState] = useState(initState);

  useEffect(() => {
    if (!state.toUpdate) return;

    axios
      .post(generateUrl("/apps/otpmanager/settings"), JSON.stringify(state), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        showNotification({
          id: "update-user-setting",
          color: "red",
          title: "Error",
          message: "Something went wrong while updating your settings",
          autoClose: 2000,
          icon: <IconX size={16} />,
        });
      });
  }, [state]);

  useEffect(() => {

    axios
    .get(generateUrl("/apps/otpmanager/settings"))
    .then((response) => {
      setState(
        state.copyWith({
          showCodes: response.data.show_codes,
          darkMode: response.data.dark_mode,
          recordsPerPage: response.data.records_per_page,
          toUpdate: false
        })
      );
    }).catch((error) => setState(initState));
  }, []);

  return (
    <UserSettingContext.Provider value={[state, setState]}>
      {children}
    </UserSettingContext.Provider>
  );
};

export { UserSettingContext, UserSettingContextProvider };
