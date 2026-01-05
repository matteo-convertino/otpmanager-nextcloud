import {generateOcsUrl} from "@nextcloud/router";

const BASE = '/apps/otpmanager'

// const generateOtpManagerUrl = (endpoint: string) => generateUrl(`${BASE}${endpoint}`);
const generateOtpManagerUrl = (endpoint: string) => generateOcsUrl(`${BASE}${endpoint}`);

export {generateOtpManagerUrl};
