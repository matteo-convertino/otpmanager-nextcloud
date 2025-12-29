import {useSecretStore} from "@/context/useSecretStore.ts";
import {AES, Hex, Utf8} from "crypto-es";

export default function useEncryption() {
    const {passwordHash, iv} = useSecretStore();

    function encrypt(plainText: string): string {
        if (passwordHash == "" || iv == "") return "";

        const key = Hex.parse(passwordHash);
        const parsedIv = Hex.parse(iv);

        return AES.encrypt(plainText, key, {iv: parsedIv}).toString();
    }

    function decrypt(cipherText: string): string {
        if (passwordHash == "" || iv == "") return "";

        const key = Hex.parse(passwordHash);
        const parsedIv = Hex.parse(iv);
        const dec = AES.decrypt(cipherText, key, {iv: parsedIv});

        return dec.toString(Utf8);
    }

    return {encrypt, decrypt};
}

