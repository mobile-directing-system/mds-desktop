import type { IpcMainInvokeEvent } from 'electron';
import { login } from '/@/backend/networkCalls';

/**
 * handler function to call backend interface
 * @param _ event not used
 * @param username username to pass to the backend for logging in
 * @param password password to pass to the backend for logging in
 * @returns boolean indicating if login was successful
 */
async function loginHandler(_:IpcMainInvokeEvent, username: string, password: string):Promise<boolean> {
  return login(username, password);
}

export { loginHandler };