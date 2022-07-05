import type { AxiosError } from 'axios';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';
import type { ErrorResult } from '../../../types';


/**
 * call /login endpoint in the backend
 * @param username username to send to the backend
 * @param password password to send to the backend
 * @returns boolean indicating if login was successful or not
 */
export async function login(username: string, pass: string): Promise<ErrorResult<boolean>> {
    try {
        const response = await Backend.instance.post('/login', {username, pass});
        //cache the received credential on login
        Backend.setAuthorizationHeader(response.data.access_token, response.data.token_type);
        return {res: true, error: false};
    } catch(error) {
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        return {error: true};
    }
}

export async function logout():Promise<ErrorResult<boolean>> {
  try {
    const response = await Backend.instance.post('/logout');
    if(response.status === 200) {
      Backend.setAuthorizationHeader('','');
    }
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}
