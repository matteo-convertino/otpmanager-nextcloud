import React, { useContext, useEffect, useState } from "react";

import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import orderBy from "lodash/orderBy";

import { generateCodes } from "../../utils/generateCodes";
import Datatable from "./Datatable";

import { SecretContext } from "./../../context/SecretProvider";

const sortByColumn = (accounts, columnAccessor, direction = "asc") => {
  return orderBy(
    accounts,
    (account) => {
      const value = account[columnAccessor];
      if (typeof value === "string") {
        return value.toLowerCase();
      }

      return value ?? "";
    },
    direction
  );
};

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

        response.data.shared_accounts.forEach((shared_account) => {
          shared_account.id = shared_account.account_id;
          delete shared_account.account_id;
        });

        response.data.accounts = response.data.accounts.concat(
          response.data.shared_accounts
        );

        response = sortByColumn(
          response.data.accounts,
          sortStatus.columnAccessor,
          sortStatus.direction
        );

        if (timer != null) {
          clearTimeout(timer);
        }

        generateCodes(
          response,
          setTimer,
          setAccounts,
          secret.passwordHash,
          secret.iv
        );

        setFetchState(false);
      };
      getData();
    } else {
      response = sortByColumn(
        accounts,
        sortStatus.columnAccessor,
        sortStatus.direction
      );
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
