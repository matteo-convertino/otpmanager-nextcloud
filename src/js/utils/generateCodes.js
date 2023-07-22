import { TOTP, HOTP } from "otpauth";
import { getAlgorithm } from "./getAlgorithm";

export function generateCodes(newAccounts, setTimer, setAccounts) {
  for (let i = 0; i < newAccounts.length; i++) {
    const account = newAccounts[i];

    if (account.type == "totp") {
      let totp = new TOTP({
        issuer: account.issuer,
        label: account.name,
        algorithm: getAlgorithm(account.algorithm),
        digits: account.digits,
        period: account.period,
        secret: account.secret,
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
          secret: account.secret,
        });

        account.code = hotp.generate();
      }
    }
  }

  setAccounts(newAccounts);

  let timeLeft = Math.round((30 - ((Date.now() / 1000) % 30)) * 1000);

  setTimer(
    setTimeout(
      () => generateCodes(newAccounts, setTimer, setAccounts),
      timeLeft
    )
  );
}
