import {generateOtpManagerOcsUrl, generateOtpManagerUrl} from "@/services/routes/generate.ts";

const BASE = '/accounts';

export const AccountRoutes = {
    CREATE: generateOtpManagerUrl(BASE),
    GET_ALL: generateOtpManagerUrl(BASE),
    GET_BY_ID: (id: number) => generateOtpManagerUrl(`${BASE}/${id}`),
    UPDATE: generateOtpManagerUrl(BASE),
    DELETE: (id: number) => generateOtpManagerUrl(`${BASE}/${id}`),
    IMPORT: generateOtpManagerUrl(`${BASE}/import`),
    UPDATE_COUNTER: generateOtpManagerOcsUrl(`${BASE}/update-counter`),
};
