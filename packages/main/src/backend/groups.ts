import type { AxiosError } from 'axios';
import type { Group, ErrorResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/groups';

/**
 * call to the /groups endponit to create a group
 * @param group the group to create
 * @returns the created group
 */
export async function createGroup(group: Group):Promise<ErrorResult<Group>> {
  try {
    const response = await Backend.instance.post(`${endpoint}`, {...group, id: undefined});
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for creating groups'};
      } else {
        return {error: true, errorMsg: 'response error when creating groups'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when creating groups'};
    } else {
      return {error: true, errorMsg: 'error when creating groups'};
    }
  }
}

/**
 * call to the /groups endpoint to update a group
 * @param group the group to update
 * @returns boolean indicating if the update was successful
 */
export async function updateGroup(group: Group):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${group.id}`, group);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for updating groups'};
      } else {
        return {error: true, errorMsg: 'response error when updating groups'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when updating groups'};
    } else {
      return {error: true, errorMsg: 'error when updating groups'};
    }
  }
}

/**
 * call to the /groups endpoint to delete groups
 * @param groupId id of the group to be deleted
 * @returns boolean indicating if the deletion was successful
 */
export async function deleteGroup(groupId: string):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.delete(`${endpoint}/${groupId}`);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'bot authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for deleting groups'};
      } else {
        return {error: true, errorMsg: 'response error when deleting groups'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when deleting groups'};
    } else {
      return {error: true, errorMsg: 'error when deleting groups'};
    }
  }
}

/**
 * call to the /groups endpoint to retrieve a number of groups
 * @param amount the amount of groups to retrieve
 * @param offset  the offset at which to begin retrieving groups
 * @param order_by the group property to use for sorting the result
 * @param order_dir the direction ('asc' or 'desc') in which to sort the result
 * @returns retrieved groups in the form of an group array
 */
export async function retrieveGroups(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Group[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/?${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''}`);
    return {res: response.data.entries, error: false, total: response.data.total};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for retrieving groups'};
      } else {
        return {error: true, errorMsg: 'response error when retrieving groups'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when retrieving groups'};
    } else {
      return {error: true, errorMsg: 'error when retrieving groups'};
    }
  }
}

/**
 * call to the /groups endpoint to retrieve a single group
 * @param groupId id of the group to be retrieved
 * @returns retrieved group
 */
export async function retrieveGroup(groupId: string):Promise<ErrorResult<Group>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${groupId}`);
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for retrieving a group'};
      } else {
        return {error: true, errorMsg: 'response error when retrieving a group'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when retrieving a group'};
    } else {
      return {error: true, errorMsg: 'error when retrieving a group'};
    }
  }
}
