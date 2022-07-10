import type { AxiosError } from 'axios';
import type { Group, ErrorResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/groups';

export async function createGroup(group: Group):Promise<ErrorResult<Group>> {
  try {
    const response = await Backend.instance.post(`${endpoint}`, {...group, id: undefined});
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

export async function updateGroup(group: Group):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${group.id}`, group);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

export async function deleteGroup(groupId: string):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.delete(`${endpoint}/${groupId}`);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

export async function retrieveGroups(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Group[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/?${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''}`);
    return {res: response.data.entries, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

export async function retrieveGroup(groupId: string):Promise<ErrorResult<Group>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${groupId}`);
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}
