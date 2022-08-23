import type { IpcMainInvokeEvent } from 'electron';
import type { Operation, ErrorResult } from '../../../types';
import { createOperation, updateOperation, retrieveOperation, retrieveOperations, searchOperations } from '/@/backend';

export async function createOperationHandler(_:IpcMainInvokeEvent, operation: Operation):Promise<ErrorResult<Operation>> {
    return createOperation(operation);
}

export async function updateOperationHandler(_:IpcMainInvokeEvent, operation: Operation):Promise<ErrorResult<boolean>> {
    return updateOperation(operation);
}

export async function retrieveOperationsHandler(_:IpcMainInvokeEvent, amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Operation[]>> {
    return retrieveOperations(amount, offset, order_by, order_dir);
}

export async function retrieveOperationHandler(_:IpcMainInvokeEvent, operationId: string):Promise<ErrorResult<Operation>> {
    return retrieveOperation(operationId);
}
/**
 * handler function to call backend {@link searchOperations} function
 * @param _ event not used
 * @param query for the search of users
 * @param limit max amount of users returned
 * @param offset offset at which to start the search
 * @returns retrieved user in error result conatiner
 */
// eslint-disable-next-line no-unused-vars
export async function searchOperationsHandler(_:IpcMainInvokeEvent, query: string, limit?: number, offset?: number):Promise<ErrorResult<Operation[]>> {
  return searchOperations(query, limit, offset);
}