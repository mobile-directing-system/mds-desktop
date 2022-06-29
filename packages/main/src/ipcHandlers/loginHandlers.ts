import type { IpcMainInvokeEvent } from 'electron';
import { login, logout } from '/@/backend';

/**
 * handler function to call backend interface
 * @param _ event not used
 * @param username username to pass to the backend for logging in
 * @param password password to pass to the backend for logging in
 * @returns boolean indicating if login was successful
 */
// eslint-disable-next-line no-unused-vars
export async function loginHandler(_:IpcMainInvokeEvent, username: string, password: string):Promise<boolean> {
  return login(username, password);
}

// eslint-disable-next-line no-unused-vars
/* _:IpcMainInvokeEvent not needed when no other parameters are specified. Also does not work
with eslint-disable-next-line no-unused-vars*/
export async function logoutHandler():Promise<boolean> {
  return logout();
}