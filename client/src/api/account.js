import Axios from "axios";
import { UrlConstants } from "../constants";

export const requestAccount = async (token) => {   
    console.log('requestAccount', token) 
    const response = await Axios.post(UrlConstants.API_BASE_URL + "/api/account", null, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    return response.data;
}