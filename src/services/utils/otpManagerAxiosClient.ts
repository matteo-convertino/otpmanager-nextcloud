import axios, {type AxiosResponse} from "@nextcloud/axios";
import type {OcsResponseDTO} from "@/dto/OcsResponseDTO.ts";

const otpManagerAxiosClient = axios.create({
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000,
});

otpManagerAxiosClient.interceptors.response.use(
    (response: AxiosResponse<OcsResponseDTO<any>>) => {
        response.data = response.data.ocs.data;

        return response;
    },
    (error) => Promise.reject(error)
);


export default otpManagerAxiosClient;
