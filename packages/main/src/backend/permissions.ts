import type { AxiosError } from 'axios';
import type { Permissions, ErrorResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/permissions/user';

export async function retrievePermissions(userId: string):Promise<ErrorResult<Permissions>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${userId}`);
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'Not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'Missing Permissions for retrieving Permissions'};
      } else {
        return {error: true, errorMsg: 'Response Error when retrieving Permissions'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'Request Error when retrieving Permissions'};
    } else {
      return {error: true, errorMsg: 'Error when updating retrieving Permissions'};
    }
  }
}

export async function updatePermissions(userId: string, permissions: Permissions):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${userId}`, permissions);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'Not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'Missing Permissions for updating Permissions'};
      } else {
        return {error: true, errorMsg: 'Response Error when updating Permissions'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'Request Error when updating Permissions'};
    } else {
      return {error: true, errorMsg: 'Error when updating Permissions'};
    }
  }
}