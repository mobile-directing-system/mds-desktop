/**
 * glue code to be able to call the backend user
 * functions from the browser context
 */

import type { User, CachedResult } from '../../types';
const { ipcRenderer } = require('electron');

export async function createUser(user: User):Promise<CachedResult<User>> {
    return ipcRenderer.invoke('createUser', user); 
}

export async function updateUser(user: User):Promise<CachedResult<User>> {
  return ipcRenderer.invoke('updateUser', user);
}

export async function updateUserPassword(userId: string, newPass:string):Promise<CachedResult<User>> {
  return ipcRenderer.invoke('updateUserPassword', userId, newPass);
}

export async function deleteUser(userId: string):Promise<CachedResult<User>> {
  return ipcRenderer.invoke('deleteUser', userId);
}

export async function retrieveUsers(amount?: number, offset?: number, orderBy?: string, orderDir?: string):Promise<CachedResult<User[]>> {
  return ipcRenderer.invoke('retrieveUsers', amount, offset, orderBy, orderDir );
}

export async function retrieveUser(userId: string):Promise<CachedResult<User>> {
  return ipcRenderer.invoke('retrieveUser', userId);
}