import type { AddressbookEntry, Channels, ErrorResult } from '../../types';
const { ipcRenderer } = require('electron');

export async function createAddressbookEntry(entry: AddressbookEntry):Promise<ErrorResult<AddressbookEntry>> {
    return ipcRenderer.invoke('createAddressbookEntry', entry); 
}

export async function updateAddressbookEntry(entry: AddressbookEntry):Promise<ErrorResult<boolean>> {
  return ipcRenderer.invoke('updateAddressbookEntry', entry);
}

export async function deleteAddressbookEntry(entryId: string):Promise<ErrorResult<boolean>> {
  return ipcRenderer.invoke('deleteAddressbookEntry', entryId);
}

export async function retrieveAddressbookEntries(amount?: number, offset?: number, orderBy?: string, orderDir?: string):Promise<ErrorResult<AddressbookEntry[]>> {
  return ipcRenderer.invoke('retrieveAddressbookEntries', amount, offset, orderBy, orderDir );
}

export async function retrieveAddressbookEntry(entryId: string):Promise<ErrorResult<AddressbookEntry>> {
  return ipcRenderer.invoke('retrieveAddressbookEntry', entryId);
}

export async function setChannels(entryId: string, channels :Channels):Promise<ErrorResult<boolean>> {
    return ipcRenderer.invoke('setChannels', entryId, channels);
}

export async function retrieveChannels(entryId:string):Promise<ErrorResult<Channels>> {
    return ipcRenderer.invoke('retrieveChannels', entryId);
}