import { TOTP, HOTP } from "otpauth";
import { getAlgorithm } from "./getAlgorithm";
import CryptoES from "crypto-es";

export function generateCodes(
  newAccounts,
  setTimer,
  setAccounts,
  password,
  iv
) {
  for (let i = 0; i < newAccounts.length; i++) {
    const account = newAccounts[i];

    if (account.decryptedSecret === undefined) {
      const key = CryptoES.enc.Hex.parse(password);
      const parsedIv = CryptoES.enc.Hex.parse(iv);
      const dec = CryptoES.AES.decrypt(account.secret, key, { iv: parsedIv });

      account.decryptedSecret = dec.toString(CryptoES.enc.Utf8);
    }

    if (account.type == "totp") {
      let totp = new TOTP({
        issuer: account.issuer,
        label: account.name,
        algorithm: getAlgorithm(account.algorithm),
        digits: account.digits,
        period: account.period,
        secret: account.decryptedSecret,
      });

      account.code = totp.generate();
    } else {
      if (account.counter == 0) {
        account.code = "Click the button to generate HOTP code";
      } else {
        let hotp = new HOTP({
          issuer: account.issuer,
          label: account.name,
          algorithm: getAlgorithm(account.algorithm),
          digits: account.digits,
          counter: account.counter,
          secret: account.decryptedSecret,
        });

        account.code = hotp.generate();
      }
    }
  }

  setAccounts(newAccounts);

  let timeLeft = Math.round((30 - ((Date.now() / 1000) % 30)) * 1000);

  setTimer(
    setTimeout(
      () =>
        generateCodes(newAccounts, setTimer, setAccounts, password, iv, false),
      timeLeft
    )
  );
}
