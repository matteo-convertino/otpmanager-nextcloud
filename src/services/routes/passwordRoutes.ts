import {generateOtpManagerOcsUrl, generateOtpManagerUrl} from "@/services/routes/generate.ts";

const BASE = '/password';

export const PasswordRoutes = {
    CREATE: generateOtpManagerUrl(BASE),
    GET: generateOtpManagerUrl(BASE),
    UPDATE: generateOtpManagerUrl(BASE),
    CHECK: generateOtpManagerOcsUrl(`${BASE}/check`),
};
