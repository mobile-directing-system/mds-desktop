import type{Intel, ErrorResult} from '../../types';
const {ipcRenderer} = require('electron');

export async function createIntel(intel: Intel):Promise<ErrorResult<Intel>> {
    return ipcRenderer.invoke('createIntel', intel);
}

export async function retrieveIntel(intelId:string):Promise<ErrorResult<Intel>> {
    return ipcRenderer.invoke('retrieveIntel', intelId);
}

export async function invalidateIntel(intelId:string):Promise<ErrorResult<boolean>> {
    return ipcRenderer.invoke('invalidateIntel', intelId);
}

export async function retrieveMultipleIntel(amount?: number, offset?: number, orderBy?: string, orderDir?: string):Promise<ErrorResult<Intel[]>> {
    return ipcRenderer.invoke('retrieveMultipleIntel', amount, offset, orderBy, orderDir );
}

export async function searchIntelByQuery(query:string, amount?: number, offset?: number, orderBy?: string, orderDir?: string):Promise<ErrorResult<Intel[]>> {
    return ipcRenderer.invoke('retrieveMultipleIntel',query, amount, offset, orderBy, orderDir );
}