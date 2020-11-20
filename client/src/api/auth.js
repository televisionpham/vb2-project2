import Axios from "axios"
import { UrlConstants, HttpHeaders, AUTH_ID } from "../constants"

export const requestAuthenticate = async (credentials) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/authenticate", null, {
        headers: {
            [HttpHeaders.AUTHORIZATION]: 'Basic ' + btoa(
                unescape(
                    encodeURIComponent(credentials.username + ":" + credentials.password)
                )
            ) + ",otp=" + credentials.otpCode,
        }
    });
    return response;
}

export const requestChallenge = async (data) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/challenge", null, {
        headers: {
            [HttpHeaders.AUTHORIZATION]: AUTH_ID + " " + data
        }
    })
    return response;
}


export const requestRegister = async (user) => {
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/register", user);
    return response;
}