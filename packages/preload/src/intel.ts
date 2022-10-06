import type{Intel, ErrorResult} from '../../types';
import type { IntelType } from '../../renderer/src/constants';
const { ipcRenderer } = require('electron');
export async function createIntel(intel: Intel):Promise<ErrorResult<Intel>> {
    return ipcRenderer.invoke('createIntel', intel);
}

export async function retrieveIntel(intelId:string):Promise<ErrorResult<Intel>> {
    return ipcRenderer.invoke('retrieveIntel', intelId);
}

export async function invalidateIntel(intelId:string):Promise<ErrorResult<boolean>> {
    return ipcRenderer.invoke('invalidateIntel', intelId);
}

export async function retrieveMultipleIntel(one_of_delivered_to_entries?: string[], one_of_delivery_for_entries?:string[], include_invalid?: boolean, min_importance?: number, intel_type?: IntelType, operationId?: string, created_by_user_id?: string, amount?: number, offset?: number,order_by?: string, order_dir?: string):Promise<ErrorResult<Intel[]>> {
    return ipcRenderer.invoke('retrieveMultipleIntel', one_of_delivered_to_entries,one_of_delivery_for_entries,include_invalid,min_importance,intel_type,operationId,created_by_user_id, amount, offset, order_by, order_dir);
}

export async function searchIntelByQuery(query:string, amount?: number, offset?: number, orderBy?: string, orderDir?: string):Promise<ErrorResult<Intel[]>> {
    return ipcRenderer.invoke('searchIntel',query, amount, offset, orderBy, orderDir );
}

export async function intelDeliveredAttempt(attepmtId:string):Promise<ErrorResult<boolean>> {
    return ipcRenderer.invoke('intelDeliveredAttempt', attepmtId);
}
export async function intelDeliveredDelivery(deliveryId:string):Promise<ErrorResult<boolean>> {
    return ipcRenderer.invoke('intelDeliveredDelivery', deliveryId);
}