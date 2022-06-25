/**
 * glue code to be able to call the backend login
 * function from the browser context
 */

const { ipcRenderer } = require('electron');
export function login(username: string, password: string):Promise<boolean> {
    return ipcRenderer.invoke('login', username, password); 
}