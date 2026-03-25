import {create} from "zustand";
import {OtpViewMode} from "@/utils/enum/otpViewMode.ts";

export const PAGE_SIZES = [10, 20, 30];

interface SettingsStore {
    showCodes: boolean;
    darkMode?: boolean;
    recordsPerPage: number,
    viewMode: OtpViewMode,
    pageOptions: number[];
    isFetching: boolean;
    setShowCodes: (showCodes: boolean) => void;
    setDarkMode: (darkMode?: boolean) => void;
    setRecordsPerPage: (recordsPerPage: number) => void;
    setViewMode: (viewMode: OtpViewMode) => void;
    setPageOptions: (pageOptions: number[]) => void;
    setIsFetching: (isFetching: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    showCodes: false,
    darkMode: undefined,
    recordsPerPage: PAGE_SIZES[0],
    viewMode: OtpViewMode.TABLE,
    pageOptions: PAGE_SIZES,
    isFetching: true,
    setShowCodes: (showCodes: boolean) => set({showCodes}),
    setDarkMode: (darkMode?: boolean) => set({darkMode}),
    setRecordsPerPage: (recordsPerPage: number) => set({recordsPerPage}),
    setViewMode: (viewMode: OtpViewMode) => set({viewMode}),
    setPageOptions: (pageOptions: number[]) => set({pageOptions}),
    setIsFetching: (isFetching: boolean) => set({isFetching}),
}));
