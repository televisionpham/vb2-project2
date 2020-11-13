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