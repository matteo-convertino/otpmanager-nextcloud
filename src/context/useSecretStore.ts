import {create} from "zustand";

interface SecretStore {
    password?: boolean;
    passwordHash: string;
    iv: string;
    auth: boolean;
    setPassword: (password?: boolean) => void;
    setPasswordHash: (passwordHash: string) => void;
    setIv: (iv: string) => void;
    setAuth: (auth: boolean) => void;
}

export const useSecretStore = create<SecretStore>((set) => ({
    password: undefined,
    passwordHash: "",
    iv: "",
    auth: false,
    setPassword: (password?: boolean) => set({password}),
    setPasswordHash: (passwordHash: string) => set({passwordHash}),
    setIv: (iv: string) => set({iv}),
    setAuth: (auth: boolean) => set({auth}),
}));
