import axios from "@nextcloud/axios";

const otpManagerAxiosClient = axios.create({
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000,
});

export default otpManagerAxiosClient;
