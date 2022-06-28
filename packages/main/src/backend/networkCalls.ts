import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import config from '/@/config';
import { loginInfo } from '/@/cache';

/**
 * cache the received credential on login
 */
const instanceData:AxiosRequestConfig = {
    baseURL: `http://${config.baseURL}:30080`,
    timeout: 2000,
};
let backendInstance = axios.create(instanceData);

/**
 * call /login endpoint in the backend
 * @param username username to send to the backend
 * @param password password to send to the backend
 * @returns boolean indicating if login was successful or not
 */
export async function loginCall(username: string, password: string): Promise<boolean> {
    try {
        const response = await backendInstance.post('/login', {username: username, pass: password});
        loginInfo.tokenType = response.data.token_type;
        loginInfo.token = response.data.access_token;
        backendInstance = axios.create({
            ...instanceData,
            headers: {'Authorization': `${loginInfo.token} ${loginInfo.tokenType}`},
        });
        return true;
    } catch(error) {
        const axError: AxiosError = error as AxiosError;
        if(axError.response) {
            console.log('Error in Response', axError.response.data, axError.response.status, axError.response.headers);
        } else if(axError.request) {
            console.log('Error in Request', axError.code, axError.message);
        } else {
            console.log('Other Error', axError);
        }
        return false;
    }
}
