import {create} from "zustand";
import type {AccountResponseDatatable} from "@/dto/utils/AccountResponseDatatable.ts";

interface ModalsStore {
    accounts?: AccountResponseDatatable[];
    isFetching: boolean;
    setAccounts: (accounts?: AccountResponseDatatable[]) => void;
    setIsFetching: (isFetching: boolean) => void;
}

export const useAccountsStore = create<ModalsStore>((set) => ({
    accounts: undefined,
    isFetching: true,
    setAccounts: (accounts?: AccountResponseDatatable[]) => set({accounts}),
    setIsFetching: (isFetching: boolean) => set({isFetching}),
}));
