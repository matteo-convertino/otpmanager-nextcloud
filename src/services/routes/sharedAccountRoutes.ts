import {generateOtpManagerOcsUrl, generateOtpManagerUrl} from "@/services/routes/generate.ts";

const BASE = '/share';

export const SharedAccountRoutes = {
    CREATE: generateOtpManagerUrl(BASE),
    GET_BY_USER: generateOtpManagerUrl(BASE),
    GET_BY_ACCOUNT_ID: (accountId: number) => generateOtpManagerUrl(`${BASE}/${accountId}`),
    GET_BY_ID: (id: number) => generateOtpManagerUrl(`${BASE}/${id}`),
    UPDATE: generateOtpManagerUrl(BASE),
    DELETE: (accountId: number) => generateOtpManagerUrl(`${BASE}/${accountId}`),
    UNLOCK: generateOtpManagerOcsUrl(`${BASE}/import`),
    UPDATE_COUNTER: generateOtpManagerOcsUrl(`${BASE}/update-counter`),
};
