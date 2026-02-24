import {generateOtpManagerUrl} from "@/services/routes/generate.ts";

const BASE = '/share';

export const SharedAccountRoutes = {
    CREATE: generateOtpManagerUrl(BASE),
    GET_ALL_BY_ACCOUNT_ID: (accountId: number) => generateOtpManagerUrl(`${BASE}/${accountId}`),
    GET_BY_ID: (id: number) => generateOtpManagerUrl(`${BASE}/${id}`),
    UPDATE: generateOtpManagerUrl(BASE),
    DELETE: (accountId: number, receiverId: string | null) => generateOtpManagerUrl(`${BASE}/${accountId}?receiverId=${receiverId === null ? '' : receiverId}`),
    UNLOCK: generateOtpManagerUrl(`${BASE}/unlock`),
    UPDATE_COUNTER: generateOtpManagerUrl(`${BASE}/update-counter`),

    GET_USERS_BY_ACCOUNT_ID: (accountId: number) => generateOtpManagerUrl(`/get-users/${accountId}`),
};
