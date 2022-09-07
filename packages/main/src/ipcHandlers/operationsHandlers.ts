import type { IpcMainInvokeEvent } from 'electron';
import type { User, Operation, ErrorResult } from '../../../types';
import { createOperation, updateOperation, retrieveOperation, retrieveOperations, searchOperations, retrieveOperationMembers, updateOperationMembers } from '/@/backend';

/**
 * handler function to call backend {@link createOperation} function
 * @param _ event not used
 * @param operation to be created
 * @returns the created operation in an error result container
 */
export async function createOperationHandler(_:IpcMainInvokeEvent, operation: Operation):Promise<ErrorResult<Operation>> {
    return createOperation(operation);
}

/**
 * handler function to call backend {@link updateOperation} function
 * @param _ event not used
 * @param operation to be updated
 * @returns boolean indicating if the update was successful in error result container
 */
export async function updateOperationHandler(_:IpcMainInvokeEvent, operation: Operation):Promise<ErrorResult<boolean>> {
    return updateOperation(operation);
}

/**
 * handler function to call {@link retrieveOperations} function
 * @param _ event not used
 * @param amount of operations to be retrieved
 * @param offset at which to begin retrieving operations
 * @param order_by which operations property to sort the results
 * @param order_dir in which to sort the results ('asc' or 'desc')
 * @returns retrieved operations in error result container
 */
export async function retrieveOperationsHandler(_:IpcMainInvokeEvent, amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Operation[]>> {
    return retrieveOperations(amount, offset, order_by, order_dir);
}

/**
 * handler function to call {@link retrieveOperation} function
 * @param _ event not used
 * @param operationId id of the operation to be retrieved
 * @returns the retrieved operation in error result container
 */
export async function retrieveOperationHandler(_:IpcMainInvokeEvent, operationId: string):Promise<ErrorResult<Operation>> {
    return retrieveOperation(operationId);
}

/**
 * handler function to call backend {@link searchOperations} function
 * @param _ event not used
 * @param query for the search of opeartions
 * @param limit max amount of opeartions returned
 * @param offset offset at which to start the search
 * @returns retrieved operations in error result container
 */
export async function searchOperationsHandler(_:IpcMainInvokeEvent, query: string, limit?: number, offset?: number):Promise<ErrorResult<Operation[]>> {
  return searchOperations(query, limit, offset);
}

/**
 * handler function to call backend {@link retrieveOperationMembers} function
 * @param _ event not used
 * @param operationId id of the operation for which to retrieve the members
 * @returns retrieved operation members in error result container
 */
export async function retrieveOperationMembersHandler(_:IpcMainInvokeEvent, operationId: string):Promise<ErrorResult<User[]>> {
  return retrieveOperationMembers(operationId);
}

/**
 * handler function to call backend {@link updateOperationMembers} function
 * @param _ event not used
 * @param operationId id of the operation for which to set the operation members
 * @param memberIds the members to which to set the operations members
 * @returns boolean indicating if the update was successful
 */
export async function updateOperationMembersHandler(_:IpcMainInvokeEvent, operationId: string, memberIds: string[]):Promise<ErrorResult<boolean>> {
  return updateOperationMembers(operationId, memberIds);
}