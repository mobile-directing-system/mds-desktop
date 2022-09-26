import type { IpcMainInvokeEvent } from 'electron';
import type {Intel, ErrorResult} from '../../../types';
import { searchIntelByQuery, createIntel, invalidateIntel, retrieveIntel, retrieveMultipleIntel} from '../../../preload/src';

export async function createIntelHandler(_:IpcMainInvokeEvent, intel: Intel):Promise<ErrorResult<Intel>> {
    return createIntel(intel);
}

export async function retrieveIntelHandler(_:IpcMainInvokeEvent, intelId: string):Promise<ErrorResult<Intel>> {
    return retrieveIntel(intelId);
}

export async function invalidateIntelHandler(_:IpcMainInvokeEvent, intelId: string):Promise<ErrorResult<boolean>> {
    return invalidateIntel(intelId);
}

export async function retrieveMultipleIntelHandler(_:IpcMainInvokeEvent, amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Intel[]>> {
    return retrieveMultipleIntel(amount, offset, order_by, order_dir);
}

export async function searchIntelByQueryHandler(_:IpcMainInvokeEvent, query:string, amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Intel[]>> {
    return searchIntelByQuery(query, amount, offset, order_by, order_dir);
}
