import type { AxiosError } from 'axios';
import type { Permissions, ErrorResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/permissions/user';

export async function retrievePermissions(userId: string):Promise<ErrorResult<Permissions>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/${userId}`);
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

export async function updatePermissions(userId: string, permissions: Permissions):Promise<ErrorResult<boolean>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    await Backend.instance.put(`${endpoint}/${userId}`, permissions);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}