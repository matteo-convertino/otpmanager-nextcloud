import {generateOtpManagerOcsUrl, generateOtpManagerUrl} from "@/services/routes/generate.ts";

const BASE = '/share';

export const SharedAccountRoutes = {
    CREATE: generateOtpManagerUrl(BASE),
    GET_ALL_BY_USER: generateOtpManagerUrl(BASE),
    GET_ALL_BY_ACCOUNT_ID: (accountId: number) => generateOtpManagerUrl(`${BASE}/${accountId}`),
    GET_BY_ID: (id: number) => generateOtpManagerUrl(`${BASE}/${id}`),
    UPDATE: generateOtpManagerUrl(BASE),
    DELETE: (accountId: number, receiverId?: number) => generateOtpManagerUrl(`${BASE}/${accountId}?receiver=${receiverId === undefined ? '' : receiverId}`),
    UNLOCK: generateOtpManagerOcsUrl(`${BASE}/unlock`),
    UPDATE_COUNTER: generateOtpManagerOcsUrl(`${BASE}/update-counter`),

    GET_USERS_BY_ACCOUNT_ID: (accountId: number) => generateOtpManagerUrl(`/get-users/${accountId}`),
};
