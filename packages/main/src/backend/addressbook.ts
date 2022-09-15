import type { AxiosError } from 'axios';
import type { AddressbookEntry, Channels, ErrorResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint ='/address-book/entries';
const channelsEndpointExtension = 'channels';

export async function createAddressbookEntry(entry:AddressbookEntry):Promise<ErrorResult<AddressbookEntry>> {
    try{
        const response = await Backend.instance.post(`${endpoint}`, {...entry, id: undefined});
        return {res: response.data, error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for creating addressbook entries'};
            } else {
                return {error: true, errorMsg: 'response error when creating addressbook entries'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when creating addressbook entries'};
        } else {
            return {error: true, errorMsg: 'error when creating addressbook entries'};
        }
    }
}

export async function updateAddressbookEntry(entry:AddressbookEntry):Promise<ErrorResult<boolean>> {
    try{
        await Backend.instance.put(`${endpoint}/${entry.id}`, {...entry, user: entry.user == ''? null : entry.user, operation: entry.operation == ''? null : entry.operation });
        return {error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for updating addressbook entries'};
            } else {
                return {error: true, errorMsg: 'response error when updating addressbook entries'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when updating addressbook entries'};
        } else {
            return {error: true, errorMsg: 'error when updating addressbook entries'};
        }
    }
}

export async function deleteAddressbookEntry(entryId:string):Promise<ErrorResult<boolean>> {
    try{
        await Backend.instance.delete(`${endpoint}/${entryId}`);
        return {error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for deleting addressbook entries'};
            } else {
                return {error: true, errorMsg: 'response error when deleting addressbook entries'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when deleting addressbook entries'};
        } else {
            return {error: true, errorMsg: 'error when deleting addressbook entries'};
        }
    }
}

export async function retrieveAddressbookEntries(amount?: number, offset?: number,order_by?: string, order_dir?: string):Promise<ErrorResult<AddressbookEntry[]>> {
    try{
        const response = await Backend.instance.get(`${endpoint}/?${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''}`);
        return {res: response.data.entries, error:false, total: response.data.total};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for retrieving addressbook entries'};
            } else {
                return {error: true, errorMsg: 'response error when retrieving addressbook entries'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when retrieving addressbook entries'};
        } else {
            return {error: true, errorMsg: 'error when retrieving addressbook entries'};
        }
    }
}

export async function retrieveAddressbookEntry(entryId:string):Promise<ErrorResult<AddressbookEntry>> {
    try{
        const response = await Backend.instance.get(`${endpoint}/${entryId}`);
        return {res: response.data, error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for retrieving addressbook entries'};
            } else {
                return {error: true, errorMsg: 'response error when retrieving addressbook entries'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when retrieving addressbook entries'};
        } else {
            return {error: true, errorMsg: 'error when retrieving addressbook entries'};
        }
    }
}

export async function searchAddressbookEntryByQuery(query: string, limit?: number, offset?: number):Promise<ErrorResult<AddressbookEntry[]>> {
    try {
        //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
        const response = await Backend.instance.get(`${endpoint}/search?${(query != null)? `&q=${query}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(limit != null)? `&limit=${limit}` : ''}`);
        return {res: response.data.hits, total: response.data.estimated_total_hits , error: false};
    } catch(error) {
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
          if(axError.response.status === 401) {
            return {error: true, errorMsg: 'not authenticated'};
          } else if(axError.response.status === 403) {
            return {error: true, errorMsg: 'missing permissions for searching entries'};
          } else {
            return {error: true, errorMsg: 'response error when searching entries'};
          }
        } else if(axError.request) {
          return {error: true, errorMsg: 'request error when searching entries'};
        } else {
          return {error: true, errorMsg: 'error when searching entries'};
        }
    }
}

export async function setChannels(entryId: string, channels:Channels):Promise<ErrorResult<boolean>> {
    try{
        await Backend.instance.put(`${endpoint}/${entryId}/${channelsEndpointExtension}`, channels.map((elem) => elem.id === '' ?  {...elem, id:undefined}: elem));
        return {error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for creating channels'};
            } else {
                return {error: true, errorMsg: 'response error when creating channels'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when creating achannels'};
        } else {
            return {error: true, errorMsg: 'error when creating channels'};
        }
    }
}
export async function retrieveChannels(entryId:string):Promise<ErrorResult<Channels>> {
    try{
        const result = await Backend.instance.get(`${endpoint}/${entryId}/${channelsEndpointExtension}`);
        return {res: result.data,error:false};
    }catch(error){
        const axError: AxiosError = error as AxiosError;
        printAxiosError(axError);
        if(axError.response) {
            if(axError.response.status === 401) {
                return {error: true, errorMsg: 'not authenticated'};
            } else if(axError.response.status === 403) {
                return {error: true, errorMsg: 'missing permissions for retrieving channels'};
            } else {
                return {error: true, errorMsg: 'response error when retrieving channels'};
            }
        } else if(axError.request) {
            return {error: true, errorMsg: 'request error when retrieving channels'};
        } else {
            return {error: true, errorMsg: 'error when retrieving channels'};
        }
    }
}