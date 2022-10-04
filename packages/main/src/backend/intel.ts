import type { AxiosError } from 'axios';
import {ref} from 'vue';
import type { Intel, ErrorResult, IntelType} from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint ='/intel';
const endpointAttempt = '/intel-delivery-attempts';
const endpointDelivery = ' /intel-deliveries';

export async function createIntel(intel:Intel):Promise<ErrorResult<Intel>> {
    try{
        const response = await Backend.instance.post(`${endpoint}`, {...intel, id: undefined, created_at: undefined, created_by: undefined});
        return {res: response.data, error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for creating Intel entries'};
            } else {
                return {error: true, errorMsg: 'response error when creating Intel entries'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when creating Intel'};
        } else {
            return {error: true, errorMsg: 'error when creating Intel'};
        }
    }
}

export async function retrieveIntel(intelId:string):Promise<ErrorResult<Intel>> {
    try{
        const response = await Backend.instance.get(`${endpoint}/${intelId}`);
        return {res: {...response.data, created_at: new Date(response.data.created_at)}, error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for retrieving Intel'};
            } else {
                return {error: true, errorMsg: 'response error when retrieving Intel'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when retrieving Intel'};
        } else {
            return {error: true, errorMsg: 'error when retrieving Intel'};
        }
    }
}
export async function searchIntelByQuery(query: string, limit?: number, offset?: number):Promise<ErrorResult<Intel[]>> {
    try {
        //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
        const response = await Backend.instance.get(`${endpoint}/search?${(query != null)? `&q=${query}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(limit != null)? `&limit=${limit}` : ''}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {res: response.data.hits.map((elem: any) => {return {...elem, created_at: new Date(elem.created_at)};}), total: response.data.estimated_total_hits , error: false};
    } catch(error) {
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
          if(axError.response.status === 401) {
            return {error: true, errorMsg: 'not authenticated'};
          } else if(axError.response.status === 403) {
            return {error: true, errorMsg: 'missing permissions for searching Intel'};
          } else {
            return {error: true, errorMsg: 'response error when searching Intel'};
          }
        } else if(axError.request) {
          return {error: true, errorMsg: 'request error when searching Intel'};
        } else {
          return {error: true, errorMsg: 'error when searching Intel'};
        }
    }
}

export async function retrieveMultipleIntel(one_of_delivered_to_entries?: string[], one_of_delivery_for_entries?:string[], include_invalid?: boolean, min_importance?: number, intel_type?: IntelType, operationId?: string, created_by_user_id?: string, amount?: number, offset?: number,order_by?: string, order_dir?: string):Promise<ErrorResult<Intel[]>> {
    try{
        const one_of_delivery_for_entriesQuery = ref('');
        if (one_of_delivery_for_entries != null){
            one_of_delivery_for_entriesQuery.value += '[';
            one_of_delivery_for_entries.forEach((elem) => one_of_delivery_for_entriesQuery.value += `"${elem}",`);
            one_of_delivery_for_entriesQuery.value = one_of_delivery_for_entriesQuery.value.slice(0,one_of_delivery_for_entriesQuery.value.length-2);
            one_of_delivery_for_entriesQuery.value += ']';
        }
        const one_of_delivered_to_entriesQuery = ref('');
        if (one_of_delivered_to_entries != null){
            one_of_delivered_to_entriesQuery.value += '[';
            one_of_delivered_to_entries.forEach((elem) => one_of_delivered_to_entriesQuery.value += `"${elem}",`);
            one_of_delivered_to_entriesQuery.value = one_of_delivered_to_entriesQuery.value.slice(0,one_of_delivered_to_entriesQuery.value.length-2);
            one_of_delivered_to_entriesQuery.value += ']';
        }
        const response = await Backend.instance.get(`${endpoint}/?${(one_of_delivery_for_entries != null)? `&one_of_delivery_for_entries=${one_of_delivery_for_entriesQuery.value}`: ''}${(one_of_delivered_to_entries != null)? `&one_of_delivered_to_entries=${one_of_delivered_to_entriesQuery.value}`: ''}${(include_invalid != null)? `&include_invalid=${include_invalid}`: ''}${(min_importance != null)? `&min_importance=${min_importance}`: ''}${(intel_type != null)? `&intel_type=${intel_type}`: ''}${(operationId != null)? `&operation=${operationId}`: ''}${(created_by_user_id != null)? `&created_by=${created_by_user_id}`: ''} ${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''} `);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {res: response.data.entries.map((elem: any) => {return {...elem, created_at: new Date(elem.created_at)};}), error:false, total: response.data.total};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for Intel'};
            } else {
                return {error: true, errorMsg: 'response error when retrieving Intel'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when retrieving Intel'};
        } else {
            return {error: true, errorMsg: 'error when retrieving Intel'};
        }
    }
}

export async function invalidateIntel(intelId:string):Promise<ErrorResult<boolean>> {
    try{
        const response = await Backend.instance.post(`${endpoint}/${intelId}/invalidate`);
        return {res: response.data, error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for invalidating Intel'};
            } else {
                return {error: true, errorMsg: 'response error when invalidating Intel'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when invalidating Intel'};
        } else {
            return {error: true, errorMsg: 'error when invalidating Intel'};
        }
    }
}
export async function intelDeliveredAttempt(attepmtId:string):Promise<ErrorResult<boolean>> {
    try{
        const response = await Backend.instance.post(`${endpointAttempt}/${attepmtId}/delivered`);
        return {res: response.data, error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for confirming delivery of Intel'};
            } else {
                return {error: true, errorMsg: 'response error when confirming delivery of Intel'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when confirming delivery of Intel'};
        } else {
            return {error: true, errorMsg: 'error when confirming delivery of Intel'};
        }
    }
}
export async function intelDeliveredDelivery(deliveryId:string):Promise<ErrorResult<boolean>> {
    try{
        const response = await Backend.instance.post(`${endpointDelivery}/${deliveryId}/delivered`);
        return {res: response.data, error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for confirming delivery of Intel'};
            } else {
                return {error: true, errorMsg: 'response error when confirming delivery of Intel'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when confirming delivery of Intel'};
        } else {
            return {error: true, errorMsg: 'error when confirming delivery of Intel'};
        }
    }
}