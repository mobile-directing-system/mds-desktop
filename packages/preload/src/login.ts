/**
 * glue code to be able to call the backend login
 * functions from the browser context
 */

const { ipcRenderer } = require('electron');
export async function login(username: string, password: string):Promise<boolean> {
    return ipcRenderer.invoke('login', username, password); 
}

export async function logout():Promise<boolean> {
  return ipcRenderer.invoke('logout');
}