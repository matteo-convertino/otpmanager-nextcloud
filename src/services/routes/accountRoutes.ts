import {generateOtpManagerUrl} from "@/services/routes/generate.ts";

const BASE = '/accounts';

export const AccountRoutes = {
    CREATE: generateOtpManagerUrl(BASE),
    GET_ALL: generateOtpManagerUrl(BASE),
    GET_ALL_DELETED: generateOtpManagerUrl(`${BASE}/deleted`),
    GET_BY_ID: (id: number) => generateOtpManagerUrl(`${BASE}/${id}`),
    UPDATE: generateOtpManagerUrl(BASE),
    DELETE: (id: number) => generateOtpManagerUrl(`${BASE}/${id}`),
    RESTORE: (id: number) => generateOtpManagerUrl(`${BASE}/${id}/restore`),
    DESTROY: (id: number) => generateOtpManagerUrl(`${BASE}/${id}/destroy`),
    IMPORT: generateOtpManagerUrl(`${BASE}/import`),
    UPDATE_COUNTER: generateOtpManagerUrl(`${BASE}/update-counter`),
};
