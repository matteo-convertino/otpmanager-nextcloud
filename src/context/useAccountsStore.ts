import {create} from "zustand";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";
import {OtpPeriod} from "@/utils/enum/otpPeriod.ts";

const timers: Partial<Record<OtpPeriod, ReturnType<typeof setTimeout>>> = {};

interface AccountsStore {
    accounts?: AccountResponseDatatable[];
    isFetching: boolean;
    totpExpiresAt: Partial<Record<OtpPeriod, number>>;
    setAccounts: (accounts?: AccountResponseDatatable[]) => void;
    setIsFetching: (isFetching: boolean) => void;
    startTotpTimers: (onTick: (period: OtpPeriod) => void) => void;
    getTotpRemainingMs: (period: OtpPeriod) => number;
    getTotpRemainingSeconds: (period: OtpPeriod) => number;
    getTotpRemainingPercent: (period: OtpPeriod) => number;
}

export const useAccountsStore = create<AccountsStore>((set, get) => ({
    accounts: undefined,
    isFetching: true,
    totpExpiresAt: {},
    setAccounts: (accounts?: AccountResponseDatatable[]) => set({accounts}),
    setIsFetching: (isFetching: boolean) => set({isFetching}),
    startTotpTimers: (onTick: (period: OtpPeriod) => void) => {
        [OtpPeriod.P30, OtpPeriod.P45, OtpPeriod.P60].forEach((period) => {
            if (timers[period] !== undefined) return;

            const tick = () => {
                const now = Date.now();
                const ms = period * 1000;
                const expiresAt = now + (ms - (now % ms));

                set((state) => ({
                    totpExpiresAt: {...state.totpExpiresAt, [period]: expiresAt},
                }));

                timers[period] = setTimeout(() => {
                    onTick(period);
                    tick();
                }, expiresAt - Date.now());
            };

            tick();
        });
    },
    getTotpRemainingMs: (period: OtpPeriod) => Math.max((get().totpExpiresAt[period] ?? 0) - Date.now(), 0),
    getTotpRemainingSeconds: (period: OtpPeriod) => Math.ceil(get().getTotpRemainingMs(period) / 1000),
    getTotpRemainingPercent: (period: OtpPeriod) => (get().getTotpRemainingMs(period) / (period * 1000)) * 100,
}));
