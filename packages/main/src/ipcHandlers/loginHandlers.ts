import type { IpcMainInvokeEvent } from 'electron';
import { login, logout } from '/@/backend';
import type { ErrorResult } from '../../../types';

/**
 * handler function to call login backend function
 * @param _ event not used
 * @param username username to pass to the backend for logging in
 * @param password password to pass to the backend for logging in
 * @returns boolean indicating if login was successful
 */
export async function loginHandler(_:IpcMainInvokeEvent, username: string, password: string):Promise<ErrorResult<boolean>> {
  return login(username, password);
}

/* _:IpcMainInvokeEvent not needed when no other parameters are specified. Also does not work
with eslint-disable-next-line no-unused-vars*/
/**
 * handler function to call logout backend function
 * @returns boolean indicating if the logout was successful
 */
export async function logoutHandler():Promise<ErrorResult<boolean>> {
  return logout();
}