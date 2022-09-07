/**
 * glue code to be able to call the backend group
 * functions from the browser context
 */

import type { Group, ErrorResult } from '../../types';
const { ipcRenderer } = require('electron');

export async function createGroup(group: Group):Promise<ErrorResult<Group>> {
    return ipcRenderer.invoke('createGroup', group); 
}

export async function updateGroup(group: Group):Promise<ErrorResult<boolean>> {
  return ipcRenderer.invoke('updateGroup', group);
}

export async function deleteGroup(groupId: string):Promise<ErrorResult<boolean>> {
  return ipcRenderer.invoke('deleteGroup', groupId);
}

export async function retrieveGroups(amount?: number, offset?: number, orderBy?: string, orderDir?: string):Promise<ErrorResult<Group[]>> {
  return ipcRenderer.invoke('retrieveGroups', amount, offset, orderBy, orderDir );
}

export async function retrieveGroup(groupId: string):Promise<ErrorResult<Group>> {
  return ipcRenderer.invoke('retrieveGroup', groupId);
}