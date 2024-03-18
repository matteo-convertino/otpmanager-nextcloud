import React, { useContext, useEffect, useState } from "react";

import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import sortBy from "lodash/sortBy";

import { generateCodes } from "../../utils/generateCodes";
import Datatable from "./Datatable";

import { SecretContext } from "./../../context/SecretProvider";

export function AccountsTable({
  setOtp,
  accounts,
  setAccounts,
  isFetching,
  setFetchState,
  setShowEditOtpAccount,
  setShowAsideInfo,
  setShowAsideShare,
  selectedAccounts,
  setSelectedAccounts,
  setSharedAccountToUnlock,
}) {
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "position",
    direction: "asc",
  });
  const [timer, setTimer] = useState(null);
  const [secret, setSecret] = useContext(SecretContext);

  useEffect(() => {
    let response = null;

    if (accounts == null) {
      const getData = async () => {
        response = await axios.get(generateUrl("/apps/otpmanager/accounts"));
        
        response.data.accounts = response.data.accounts.concat(response.data.shared_accounts);

        response = sortBy(response.data.accounts, sortStatus.columnAccessor);

        if (timer != null) {
          clearTimeout(timer);
        }

        generateCodes(
          response,
          setTimer,
          setAccounts,
          secret.passwordHash,
          secret.iv,
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
      setShowAsideInfo={setShowAsideInfo}
      setShowAsideShare={setShowAsideShare}      
      setShowEditOtpAccount={setShowEditOtpAccount}
      sortStatus={sortStatus}
      setSortStatus={setSortStatus}
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
      setSharedAccountToUnlock={setSharedAccountToUnlock}
    />
  );
}
