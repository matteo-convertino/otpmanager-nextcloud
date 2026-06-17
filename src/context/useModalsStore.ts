import {create} from "zustand";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";

export type DeleteOtpAccountAction = "delete" | "destroy";

interface ModalsStore {
    showCreateAccount: boolean;
    showEditOtpAccount?: AccountResponseDatatable;
    showDeleteOtpAccount?: AccountResponseDatatable;
    deleteOtpAccountAction: DeleteOtpAccountAction;
    showSharedAccountToUnlock?: AccountResponseDatatable;
    showChangePassword: boolean;
    showImportExport: boolean;
    showApps: boolean;
    showSupport: boolean;
    showFeedbackIosApp: boolean;
    showUpdateNews?: string;
    setShowCreateAccount: (showCreateAccount: boolean) => void;
    setShowEditOtpAccount: (showEditOtpAccount?: AccountResponseDatatable) => void;
    setShowDeleteOtpAccount: (
        showDeleteOtpAccount?: AccountResponseDatatable,
        deleteOtpAccountAction?: DeleteOtpAccountAction
    ) => void;
    setShowSharedAccountToUnlock: (showSharedAccountToUnlock?: AccountResponseDatatable) => void;
    setShowChangePassword: (showChangePassword: boolean) => void;
    setShowImportExport: (showImportExport: boolean) => void;
    setShowApps: (showApps: boolean) => void;
    setShowSupport: (showSupport: boolean) => void;
    setShowFeedbackIosApp: (showFeedbackIosApp: boolean) => void;
    setShowUpdateNews: (showUpdateNews?: string) => void;
}

export const useModalsStore = create<ModalsStore>((set) => ({
    showCreateAccount: false,
    showEditOtpAccount: undefined,
    showDeleteOtpAccount: undefined,
    deleteOtpAccountAction: "delete",
    showSharedAccountToUnlock: undefined,
    showChangePassword: false,
    showImportExport: false,
    showApps: false,
    showSupport: false,
    showFeedbackIosApp: false,
    showUpdateNews: undefined,
    setShowCreateAccount: (showCreateAccount: boolean) => set({showCreateAccount}),
    setShowEditOtpAccount: (showEditOtpAccount?: AccountResponseDatatable) => set({showEditOtpAccount}),
    setShowDeleteOtpAccount: (
        showDeleteOtpAccount?: AccountResponseDatatable,
        deleteOtpAccountAction: DeleteOtpAccountAction = "delete"
    ) => set({showDeleteOtpAccount, deleteOtpAccountAction}),
    setShowSharedAccountToUnlock: (showSharedAccountToUnlock?: AccountResponseDatatable) => set({showSharedAccountToUnlock}),
    setShowChangePassword: (showChangePassword: boolean) => set({showChangePassword}),
    setShowImportExport: (showImportExport: boolean) => set({showImportExport}),
    setShowApps: (showApps: boolean) => set({showApps}),
    setShowSupport: (showSupport: boolean) => set({showSupport}),
    setShowFeedbackIosApp: (showFeedbackIosApp: boolean) => set({showFeedbackIosApp}),
    setShowUpdateNews: (showUpdateNews?: string) => set({showUpdateNews: showUpdateNews}),
}));
