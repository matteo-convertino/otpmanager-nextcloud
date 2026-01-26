import {create} from "zustand";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";

interface ModalsStore {
    showCreateAccount: boolean;
    showEditOtpAccount?: AccountResponseDatatable;
    showDeleteOtpAccount?: AccountResponseDatatable;
    showSharedAccountToUnlock?: AccountResponseDatatable;
    showChangePassword: boolean;
    showImportExport: boolean;
    showApps: boolean;
    setShowCreateAccount: (showCreateAccount: boolean) => void;
    setShowEditOtpAccount: (showEditOtpAccount?: AccountResponseDatatable) => void;
    setShowDeleteOtpAccount: (showDeleteOtpAccount?: AccountResponseDatatable) => void;
    setShowSharedAccountToUnlock: (showSharedAccountToUnlock?: AccountResponseDatatable) => void;
    setShowChangePassword: (showChangePassword: boolean) => void;
    setShowImportExport: (showImportExport: boolean) => void;
    setShowApps: (showApps: boolean) => void;
}

export const useModalsStore = create<ModalsStore>((set) => ({
    showCreateAccount: false,
    showEditOtpAccount: undefined,
    showDeleteOtpAccount: undefined,
    showSharedAccountToUnlock: undefined,
    showChangePassword: false,
    showImportExport: false,
    showApps: false,
    setShowCreateAccount: (showCreateAccount: boolean) => set({showCreateAccount}),
    setShowEditOtpAccount: (showEditOtpAccount?: AccountResponseDatatable) => set({showEditOtpAccount}),
    setShowDeleteOtpAccount: (showDeleteOtpAccount?: AccountResponseDatatable) => set({showDeleteOtpAccount}),
    setShowSharedAccountToUnlock: (showSharedAccountToUnlock?: AccountResponseDatatable) => set({showSharedAccountToUnlock}),
    setShowChangePassword: (showChangePassword: boolean) => set({showChangePassword}),
    setShowImportExport: (showImportExport: boolean) => set({showImportExport}),
    setShowApps: (showApps: boolean) => set({showApps}),
}));
