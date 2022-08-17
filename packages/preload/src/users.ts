/**
 * glue code to be able to call the backend user
 * functions from the browser context
 */

import type { User, ErrorResult } from '../../types';
const { ipcRenderer } = require('electron');

export async function createUser(user: User):Promise<ErrorResult<User>> {
    return ipcRenderer.invoke('createUser', user); 
}

export async function updateUser(user: User):Promise<ErrorResult<boolean>> {
  return ipcRenderer.invoke('updateUser', user);
}

export async function updateUserPassword(userId: string, newPass:string):Promise<ErrorResult<boolean>> {
  return ipcRenderer.invoke('updateUserPassword', userId, newPass);
}

export async function deleteUser(userId: string):Promise<ErrorResult<boolean>> {
  return ipcRenderer.invoke('deleteUser', userId);
}

export async function retrieveUsers(amount?: number, offset?: number, orderBy?: string, orderDir?: string):Promise<ErrorResult<User[]>> {
  return ipcRenderer.invoke('retrieveUsers', amount, offset, orderBy, orderDir );
}

export async function retrieveUser(userId: string):Promise<ErrorResult<User>> {
  return ipcRenderer.invoke('retrieveUser', userId);
}

export async function searchUsers(query: string, limit?: number, offset?: number):Promise<ErrorResult<User[]>> {
  return ipcRenderer.invoke('searchUsers', query, limit, offset);
}