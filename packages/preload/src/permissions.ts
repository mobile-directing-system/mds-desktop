/**
 * glue code to be able to call the backend permission
 * functions from the browser context
 */

import type { Permission, ErrorResult } from '../../types';
const { ipcRenderer } = require('electron');

export async function retrievePermissions(userId: string):Promise<ErrorResult<Permission[]>> {
    return ipcRenderer.invoke('retrievePermissions', userId); 
}

export async function updatePermissions(userId: string, permissions: Permission[]):Promise<ErrorResult<boolean>> {
  return ipcRenderer.invoke('updatePermissions', userId, permissions);
}