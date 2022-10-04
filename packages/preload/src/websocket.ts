import type { IpcRendererEvent } from 'electron';

const { ipcRenderer } = require('electron');

//import intel store and call action to add messages to the store
export function handleIncomingIntel(callback: (_:IpcRendererEvent, intelIds: string[]) => void ):void {
  ipcRenderer.on('addIntel', callback);
}

export {};