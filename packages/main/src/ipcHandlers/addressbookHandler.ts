import type { IpcMainInvokeEvent } from 'electron';
import type { AddressbookEntry, ErrorResult, Channels } from '../../../types';
import { createAddressbookEntry, updateAddressbookEntry, deleteAddressbookEntry, retrieveAddressbookEntries,searchAddressbookEntryByQuery, retrieveAddressbookEntry, setChannels, retrieveChannels} from '/@/backend';


export async function createAddressbookEntryHandler(_:IpcMainInvokeEvent, entry: AddressbookEntry):Promise<ErrorResult<AddressbookEntry>> {
    return createAddressbookEntry(entry);
}

export async function updateAddressbookEntryHandler(_:IpcMainInvokeEvent, entry: AddressbookEntry):Promise<ErrorResult<boolean>> {
    return updateAddressbookEntry(entry);
}

export async function deleteAddressbookEntryHandler(_:IpcMainInvokeEvent, entryId: string):Promise<ErrorResult<boolean>> {
    return deleteAddressbookEntry(entryId);
}

export async function retrieveAddressbookEntriesHandler(_:IpcMainInvokeEvent, amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<AddressbookEntry[]>> {
    return retrieveAddressbookEntries(amount, offset, order_by, order_dir);
}

export async function retrieveAddressbookEntryHandler(_:IpcMainInvokeEvent, entryId: string):Promise<ErrorResult<AddressbookEntry>> {
    return retrieveAddressbookEntry(entryId);
}

export async function setChannelsHandler(_:IpcMainInvokeEvent,entryId : string, channels: Channels):Promise<ErrorResult<boolean>> {
    return setChannels(entryId,channels);
}
export async function retrieveChannlesHandler(_:IpcMainInvokeEvent, entryId: string):Promise<ErrorResult<Channels>> {
    return retrieveChannels(entryId);
}

export async function searchAddressbookEntryByQueryHandler(_:IpcMainInvokeEvent, query: string, limit?: number, offset?: number):Promise<ErrorResult<AddressbookEntry[]>> {
    return searchAddressbookEntryByQuery(query, limit, offset);
}
