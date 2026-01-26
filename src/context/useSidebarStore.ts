import {create} from "zustand";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";

interface SidebarStore {
    showAsideInfo?: AccountResponseDatatable;
    showAsideShare?: AccountResponseDatatable;
    showNavbarSmallDevice: boolean;
    setShowNavbarSmallDevice: (showNavbarSmallDevice: boolean) => void;
    setShowAsideInfo: (showAsideInfo?: AccountResponseDatatable) => void;
    setShowAsideShare: (showAsideShare?: AccountResponseDatatable) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    showAsideInfo: undefined,
    showAsideShare: undefined,
    showNavbarSmallDevice: false,
    setShowNavbarSmallDevice: (showNavbarSmallDevice: boolean) => set({showNavbarSmallDevice}),
    setShowAsideInfo: (showAsideInfo?: AccountResponseDatatable) => set({showAsideInfo}),
    setShowAsideShare: (showAsideShare?: AccountResponseDatatable) => set({showAsideShare}),
}));
