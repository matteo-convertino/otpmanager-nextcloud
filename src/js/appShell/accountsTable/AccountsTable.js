import React, { useState, useEffect, useContext } from "react";

import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import sortBy from "lodash/sortBy";

import Datatable from "./Datatable";
import { generateCodes } from "../../utils/generateCodes";

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
    console.log(userSetting);
    //console.log("aaaaaaa");
    //console.log(aes256.decrypt("2cea02d12c747661358dfe9b77425628", "hNUSK6y+5sNdh8s4zI+UXg=="));

    /*const key = CryptoJS.enc.Hex.parse("5667726582ed68c43c9eacb4fd432c8b7716c3c31aa767860c616a033ff5cdc1");
    //const iv = CryptoJS.lib.WordArray.create([], 16);
    const iv = CryptoES.enc.Hex.parse("bf02f6302e2705049425887c6c31be4f");
    const ciphertext = "OFoshiw5Cgx2NdxoWo4U3+g=";
    
    const dec = CryptoJS.AES.decrypt(ciphertext, key, {iv:  iv});
    
    console.log(dec.toString(CryptoJS.enc.Base64));
    console.log(dec.toString(CryptoJS.enc.Utf8));*/
    /*var crypto = require('crypto');

    var key = CryptoES.enc.Hex.parse('5667726582ed68c43c9eacb4fd432c8b7716c3c31aa767860c616a033ff5cdc1');
    var iv = '39306434643734373038313034353832';
    var enc = 'H3Ar/cdjcOTkWjQOOn53AJ1DDA==';
    var parsed_iv = CryptoES.SHA256(iv).toString().substring(0, 16);

    function decrypt(k, i, v) {
      v = new Buffer.from(v, 'base64');
      var decipher = crypto.createDecipheriv('aes-256-ctr', k, i);
      decipher.setAutoPadding(false);
      var s = decipher.update(v, 'base64', 'utf8');
      return Buffer.concat([s,decipher.final('utf8')]);
    }
    var dec = decrypt(key, parsed_iv, enc);
    console.log(dec);*/
    // Stringa crittografata in base64 (ottenuta da PHP)
    /*const encryptedDataB64 = "NesifsdO/GGEH/OzCwNxYkf5og=="; // Sostituisci con la tua stringa crittografata

    // Chiave segreta (ottenuta da PHP)
    const keyHex =
      "5667726582ed68c43c9eacb4fd432c8b7716c3c31aa767860c616a033ff5cdc1"; // Sostituisci con la chiave hash ottenuta da PHP
    const ivHex = "66663765363533303236363561396461"; // Sostituisci con il tuo IV

    // Decodifica la chiave dall'hex
    const key = CryptoES.enc.Hex.parse(keyHex);
    const iv = new TextEncoder().encode(ivHex);

    const iv2 = CryptoJS.lib.WordArray.create(iv, 16);
    console.log(iv2);
    // Decrittazione AES-256-CTR
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedDataB64,
      key,
      {
        iv: iv2,
        mode: CryptoJS.mode.CTR,
      }
    );

    // Converte i dati decriptati in una stringa UTF-8
    //const plaintext = decryptedData.toString(CryptoJS.enc.Utf8);

    //console.log(plaintext);
    console.log(decryptedData.toString());*/

    //console.log(key);
    //console.log(customDecrypt(key, iv, "H3Ar/cdjcOTkWjQOOn53AJ1DDQ=="));
    /*console.log(userSetting);
    console.log("password");
    console.log(CryptoES.enc.Hex.parse(userSetting.password));
    console.log(CryptoES.enc.Hex.parse(userSetting.password).toString());
    console.log("iv");
    console.log(CryptoES.enc.Hex.parse(userSetting.iv));
    console.log(CryptoES.enc.Hex.parse(userSetting.iv).toString());

    console.log("Encryption");
    var enc = CryptoES.AES.encrypt(
      "AAAAAAAAAAAAAAAAAAAAA",
      userSetting.password,
      { mode: CryptoES.mode.CTR, iv: userSetting.iv, padding: CryptoES.pad.Pkcs7 }
    );

    console.log(enc)
    console.log(enc.toString());

    console.log("Decryption");
    var decrypted = CryptoES.AES.decrypt(
      "5hXCGS8+YN1QTp0HulDHK3+he65T",
      CryptoES.enc.Hex.parse(userSetting.password),
      { mode: CryptoES.mode.CTR, iv: userSetting.iv, padding: CryptoES.pad.Pkcs7 }
    );
    //console.log(decryptedPlainText);
    console.log(decrypted);
    console.log(decrypted.toString());
    console.log(decrypted.toString(CryptoES.enc.Utf8));*/

    //return;
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
