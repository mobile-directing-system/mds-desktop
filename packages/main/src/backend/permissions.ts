import type { AxiosError } from 'axios';
import type { Permission, ErrorResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/permissions/user';

/**
 * call the /permissions endpoint to retrieve the permissions for one user
 * @param userId id of the user for which to get permissions
 * @returns the permissions for a given user
 */
export async function retrievePermissions(userId: string):Promise<ErrorResult<Permission[]>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${userId}`);
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for retrieving permissions'};
      } else {
        return {error: true, errorMsg: 'response error when retrieving permissions'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when retrieving permissions'};
    } else {
      return {error: true, errorMsg: 'error when updating retrieving permissions'};
    }
  }
}

/**
 * call to the /permissions endpoint to set the permissions for one user
 * @param userId id of the user for which to set the permissions
 * @param permissions the permissions which to set for the user
 * @returns boolean indicating whether the operation in the backend was successful or not
 */
export async function updatePermissions(userId: string, permissions: Permission[]):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${userId}`, permissions);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for updating permissions'};
      } else {
        return {error: true, errorMsg: 'response error when updating permissions'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when updating permissions'};
    } else {
      return {error: true, errorMsg: 'error when updating permissions'};
    }
  }
}