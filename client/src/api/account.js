import Axios from "axios";
import { UrlConstants } from "../constants";

export const requestAccount = async (token) => {   
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/account", null, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    console.log(response);
    return response;
}

export const requestQrCode = async (token) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/getqrcode", null, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    console.log(response);
    return response;
}

export const requestActivate2fa = async (token) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/activate2fa", null, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    console.log(response);
    return response;
}

export const requestDeactivate2fa = async (token) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/deactivate2fa", null, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    console.log(response);
    return response;
}

export const requestUpdateInfo = async (token, user) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/updateuserinfo", user, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    console.log(response);
    return response;
}

export const requestVerifyOtp = async (token, otpCode) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/verifyotp", null, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'OTP': otpCode
        }
    });
    console.log(response);
    return response;
}