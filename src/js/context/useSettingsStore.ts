import {create} from "zustand";

interface SettingsStore {
    showCodes: boolean;
    darkMode?: boolean;
    recordsPerPage: string,
    setShowCodes: (showCodes: boolean) => void;
    setDarkMode: (darkMode?: boolean) => void;
    setRecordsPerPage: (recordsPerPage: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    showCodes: false,
    darkMode: undefined,
    recordsPerPage: "10",
    setShowCodes: (showCodes: boolean) => set({showCodes}),
    setDarkMode: (darkMode?: boolean) => set({darkMode}),
    setRecordsPerPage: (recordsPerPage: string) => set({recordsPerPage}),
}));
