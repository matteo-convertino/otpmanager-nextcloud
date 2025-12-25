import {create} from "zustand";

export const PAGE_SIZES = [10, 20, 30];
// const PAGE_SIZES = ["10", "20", "30", "All"];

interface SettingsStore {
    showCodes: boolean;
    darkMode?: boolean;
    recordsPerPage: number,
    setShowCodes: (showCodes: boolean) => void;
    setDarkMode: (darkMode?: boolean) => void;
    setRecordsPerPage: (recordsPerPage: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    showCodes: false,
    darkMode: undefined,
    recordsPerPage: PAGE_SIZES[0],
    setShowCodes: (showCodes: boolean) => set({showCodes}),
    setDarkMode: (darkMode?: boolean) => set({darkMode}),
    setRecordsPerPage: (recordsPerPage: number) => set({recordsPerPage}),
}));
