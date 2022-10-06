import type { AxiosError } from 'axios';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';
import { setupWebsocketListeners } from './websocket';
import type { ErrorResult } from '../../../types';


/**
 * call to the /login endpoint to log a specified user in
 * @param username username to send to the backend
 * @param password password to send to the backend
 * @returns boolean indicating if login was successful or not
 */
export async function login(username: string, pass: string): Promise<ErrorResult<string>> {
    try {
        const response = await Backend.instance.post('/login', {username, pass});
        //cache the received credential on login
        Backend.setAuthorizationHeader(response.data.access_token, response.data.token_type);
        Backend.connectWebsocket(response.data.access_token, response.data.token_type);
        setupWebsocketListeners();
        return {res: response.data.user_id, error: false};
    } catch(error) {
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        return {error: true, errorMsg: 'login failed'};
    }
}

/**
 * call to the /logout endpoint to log the currently logged in user out
 * @returns result indicating if the login was succesful
 */
export async function logout():Promise<ErrorResult<boolean>> {
  try {
    Backend.disconnectWebsocket();
    const response = await Backend.instance.post('/logout');
    if(response.status === 200) {
      Backend.setAuthorizationHeader('','');
    }
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true, errorMsg: 'logout failed'};
  }
}
