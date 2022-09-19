/**
 * glue code to be able to call the backend login/logout
 * functions from the browser context
 */

const { ipcRenderer } = require('electron');
import type { ErrorResult } from '../../types';
export async function login(username: string, password: string):Promise<ErrorResult<string>> {
    return ipcRenderer.invoke('login', username, password); 
}

export async function logout():Promise<ErrorResult<boolean>> {
  return ipcRenderer.invoke('logout');
}