import type { Operation, ErrorResult } from '../../types';
const { ipcRenderer } = require('electron');

export async function createOperation(operation: Operation):Promise<ErrorResult<Operation>> {
    return ipcRenderer.invoke('createOperation', operation); 
}

export async function updateOperation(operation: Operation):Promise<ErrorResult<boolean>> {
    return ipcRenderer.invoke('updateOperation', operation); 
}

export async function retrieveOperation(operationId: string):Promise<ErrorResult<Operation>> {
    return ipcRenderer.invoke('retrieveOperation', operationId); 
}

export async function retrieveOperations(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Operation[]>> {
    return ipcRenderer.invoke('retrieveOperations', amount, offset, order_by, order_dir); 
}