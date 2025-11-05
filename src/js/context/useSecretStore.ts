import {create} from "zustand";

interface SecretStore {
    password: string;
    passwordHash: string;
    iv: string;
    setPassword: (password: string) => void;
    setPasswordHash: (passwordHash: string) => void;
    setIv: (iv: string) => void;
}

export const useSecretStore = create<SecretStore>((set) => ({
    password: "",
    passwordHash: "",
    iv: "",
    setPassword: (password: string) => set({password}),
    setPasswordHash: (passwordHash: string) => set({passwordHash}),
    setIv: (iv: string) => set({iv}),
}));
