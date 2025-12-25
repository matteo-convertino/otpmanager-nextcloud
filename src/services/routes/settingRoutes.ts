import {generateOtpManagerUrl} from "@/services/routes/generate.ts";

const BASE = '/settings';

export const SettingRoutes = {
    SAVE: generateOtpManagerUrl(BASE),
    GET: generateOtpManagerUrl(BASE),
};
