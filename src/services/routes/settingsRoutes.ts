import {generateOtpManagerUrl} from "@/services/routes/generate.ts";

const BASE = '/settings';

export const SettingsRoutes = {
    SAVE: generateOtpManagerUrl(BASE),
    GET: generateOtpManagerUrl(BASE),
};
