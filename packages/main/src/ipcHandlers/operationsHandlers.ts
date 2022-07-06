import type { IpcMainInvokeEvent } from 'electron';
import type { Operation, ErrorResult } from '../../../types';
import { createOperation, updateOperation, retrieveOperation, retrieveOperations } from '/@/backend';

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