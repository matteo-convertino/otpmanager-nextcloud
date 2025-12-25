import {generateOcsUrl, generateUrl} from "@nextcloud/router";

const BASE = '/apps/otpmanager'

const generateOtpManagerUrl = (endpoint: string) => generateUrl(`${BASE}${endpoint}`);
const generateOtpManagerOcsUrl = (endpoint: string) => generateOcsUrl(`${BASE}${endpoint}`);

export {generateOtpManagerUrl, generateOtpManagerOcsUrl};
