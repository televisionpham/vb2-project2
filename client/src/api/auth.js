import Axios from "axios"
import { UrlConstants } from "../constants"

export const requestAuthenticate = async (credentials) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/authenticate", null, {
        headers: {
            'Authorization': 'Basic ' + btoa(
                unescape(
                    encodeURIComponent(credentials.username + ":" + credentials.password)
                )
            ) + ",otp=" + credentials.otpCode,
        }
    });
    return response;
}


export const requestRegister = async (user) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/register", user);
    return response;
}