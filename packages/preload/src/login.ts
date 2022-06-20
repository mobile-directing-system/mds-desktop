const { ipcRenderer } = require('electron');
export function login(username: string, password: string):Promise<boolean> {
    return ipcRenderer.invoke('login', username, password); 
}