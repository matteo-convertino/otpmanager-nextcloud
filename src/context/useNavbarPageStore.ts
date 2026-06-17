import {create} from "zustand";
import {NavbarPage} from "@/utils/enum/navbarPage.ts";

interface NavbarPageStore {
    activePage: NavbarPage;
    setActivePage: (activePage: NavbarPage) => void;
}

export const useNavbarPageStore = create<NavbarPageStore>((set) => ({
    activePage: NavbarPage.ALL,
    setActivePage: (activePage: NavbarPage) => set({activePage}),
}));
