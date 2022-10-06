import type { IpcRendererEvent } from 'electron';
import type { InAppNotification } from '../../types';

const {ipcRenderer} = require('electron');

//import intel store and call action to add messages to the store
export function handleIncomingInAppNotifications( callback: (_:IpcRendererEvent, inAppNotification: InAppNotification) => void ):void {
  ipcRenderer.on('addInAppNotification', callback);
}