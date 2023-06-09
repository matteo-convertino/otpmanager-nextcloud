import React, { useState, useEffect } from "react";

import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import sortBy from "lodash/sortBy";

import Datatable from "./Datatable";
import { generateCodes } from "../../utils/generateCodes";

export function AccountsTable({
  setOtp,
  accounts,
  setAccounts,
  isFetching,
  setFetchState,
  setShowEditOtpAccount,
  setShowAside,
  showCodes,
  selectedAccounts,
  setSelectedAccounts
}) {
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "position",
    direction: "asc",
  });
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    let response = null;

    if (accounts == null) {
      const getData = async () => {
        response = await axios.get(generateUrl("/apps/otpmanager/accounts"));
        response = sortBy(response.data.accounts, sortStatus.columnAccessor);

        if (timer != null) {
          clearTimeout(timer);
        }
        generateCodes(response, setTimer, setAccounts);

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
      showCodes={showCodes}
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    />
  );
}
