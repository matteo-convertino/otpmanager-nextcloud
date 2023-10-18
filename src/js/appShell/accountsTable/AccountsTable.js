import React, { useContext, useEffect, useState } from "react";

import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import sortBy from "lodash/sortBy";

import { generateCodes } from "../../utils/generateCodes";
import Datatable from "./Datatable";

import { UserSettingContext } from "./../../utils/UserSettingProvider";

export function AccountsTable({
  setOtp,
  accounts,
  setAccounts,
  isFetching,
  setFetchState,
  setShowEditOtpAccount,
  setShowAside,
  selectedAccounts,
  setSelectedAccounts,
}) {
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "position",
    direction: "asc",
  });
  const [timer, setTimer] = useState(null);
  const [userSetting, setUserSetting] = useContext(UserSettingContext);

  useEffect(() => {
    let response = null;

    if (accounts == null) {
      const getData = async () => {
        response = await axios.get(generateUrl("/apps/otpmanager/accounts"));
        response = sortBy(response.data.accounts, sortStatus.columnAccessor);

        if (timer != null) {
          clearTimeout(timer);
        }
        generateCodes(
          response,
          setTimer,
          setAccounts,
          userSetting.password,
          userSetting.iv,
          true
        );

        setFetchState(false);
      };
      getData();
    } else {
      response = sortBy(accounts, sortStatus.columnAccessor);
      if (sortStatus.direction === "desc") response = response.reverse();
      setAccounts(response);
    }
  }, [sortStatus, isFetching]);

  return (
    <Datatable
      isFetching={isFetching}
      setFetchState={setFetchState}
      accounts={accounts}
      setAccounts={setAccounts}
      setOtp={setOtp}
      setShowAside={setShowAside}
      setShowEditOtpAccount={setShowEditOtpAccount}
      sortStatus={sortStatus}
      setSortStatus={setSortStatus}
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    />
  );
}
