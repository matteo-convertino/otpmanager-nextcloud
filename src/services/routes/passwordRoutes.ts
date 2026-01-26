import {generateOtpManagerUrl} from "@/services/routes/generate.ts";

const BASE = '/password';

export const PasswordRoutes = {
    CREATE: generateOtpManagerUrl(BASE),
    STATUS: generateOtpManagerUrl(`${BASE}/status`),
    UPDATE: generateOtpManagerUrl(BASE),
    CHECK: generateOtpManagerUrl(`${BASE}/check`),
};
