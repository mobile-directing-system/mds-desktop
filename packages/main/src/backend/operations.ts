import type { AxiosError } from 'axios';
import type { Operation, ErrorResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/operations';

export async function createOperation(operation: Operation):Promise<ErrorResult<Operation>> {
  try {
    const response = await Backend.instance.post(`${endpoint}`, {...operation, id: undefined});
    return {res: {...response.data, start: new Date(response.data.start), end: new Date(response.data.end) }, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

export async function updateOperation(operation: Operation):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${operation.id}`, operation);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

export async function retrieveOperations(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Operation[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/?${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''}`);
    return {res: response.data.entries.map((elem:{id: string, title: string, description: string, start: string, end: string, is_archived: boolean}) => {
      return { ...elem, start: new Date(elem.start), end: new Date(elem.end) };
    }), error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

export async function retrieveOperation(operationId: string):Promise<ErrorResult<Operation>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${operationId}`);
    return {res: {...response.data, start: new Date(response.data.start), end: new Date(response.data.end) }, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

