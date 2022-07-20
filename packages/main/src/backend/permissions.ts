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

export async function updatePermissions(userId: string, permissions: Permissions):Promise<ErrorResult<boolean>> {
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