import {create} from "zustand";

export const PAGE_SIZES = [10, 20, 30];

interface SettingsStore {
    showCodes: boolean;
    darkMode?: boolean;
    recordsPerPage: number,
    pageOptions: number[];
    setShowCodes: (showCodes: boolean) => void;
    setDarkMode: (darkMode?: boolean) => void;
    setRecordsPerPage: (recordsPerPage: number) => void;
    setPageOptions: (pageOptions: number[]) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    showCodes: false,
    darkMode: undefined,
    recordsPerPage: PAGE_SIZES[0],
    pageOptions: PAGE_SIZES,
    setShowCodes: (showCodes: boolean) => set({showCodes}),
    setDarkMode: (darkMode?: boolean) => set({darkMode}),
    setRecordsPerPage: (recordsPerPage: number) => set({recordsPerPage}),
    setPageOptions: (pageOptions: number[]) => set({pageOptions}),
}));
