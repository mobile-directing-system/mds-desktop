import type { IpcMainInvokeEvent } from 'electron';
import type {Intel, ErrorResult} from '../../../types';
import type { IntelType } from '../../../renderer/src/constants';
import { searchIntelByQuery, createIntel, invalidateIntel, retrieveIntel, retrieveMultipleIntel, intelDeliveredAttempt, intelDeliveredDelivery} from '/@/backend';

export async function createIntelHandler(_:IpcMainInvokeEvent, intel: Intel):Promise<ErrorResult<Intel>> {
    return createIntel(intel);
}

export async function retrieveIntelHandler(_:IpcMainInvokeEvent, intelId: string):Promise<ErrorResult<Intel>> {
    return retrieveIntel(intelId);
}

export async function invalidateIntelHandler(_:IpcMainInvokeEvent, intelId: string):Promise<ErrorResult<boolean>> {
    return invalidateIntel(intelId);
}

export async function retrieveMultipleIntelHandler(_:IpcMainInvokeEvent, one_of_delivered_to_entries?: string[], one_of_delivery_for_entries?:string[], include_invalid?: boolean, min_importance?: number, intel_type?: IntelType, operationId?: string, created_by_user_id?: string, amount?: number, offset?: number,order_by?: string, order_dir?: string):Promise<ErrorResult<Intel[]>> {
    return retrieveMultipleIntel(one_of_delivered_to_entries,one_of_delivery_for_entries,include_invalid,min_importance,intel_type,operationId,created_by_user_id, amount, offset, order_by, order_dir);
}

export async function searchIntelByQueryHandler(_:IpcMainInvokeEvent, query:string, amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Intel[]>> {
    return searchIntelByQuery(query, amount, offset, order_by, order_dir);
}
export async function intelDeliveredAttemptHandler(_:IpcMainInvokeEvent, attepmtId:string):Promise<ErrorResult<boolean>> {
    return intelDeliveredAttempt(attepmtId);
}
export async function intelDeliveredDeliveryHandler(_:IpcMainInvokeEvent, deliveryId:string):Promise<ErrorResult<boolean>> {
    return intelDeliveredDelivery(deliveryId);
}