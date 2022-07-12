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
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'Not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'Missing Permissions for creating Groups'};
      } else {
        return {error: true, errorMsg: 'Response Error when creating Groups'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'Request Error when creating Groups'};
    } else {
      return {error: true, errorMsg: 'Error when creating Groups'};
    }
  }
}

export async function updateGroup(group: Group):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${group.id}`, group);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'Not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'Missing Permissions for updating Groups'};
      } else {
        return {error: true, errorMsg: 'Response Error when updating Groups'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'Request Error when updating Groups'};
    } else {
      return {error: true, errorMsg: 'Error when updating Groups'};
    }
  }
}

export async function deleteGroup(groupId: string):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.delete(`${endpoint}/${groupId}`);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'Not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'Missing Permissions for deleting Groups'};
      } else {
        return {error: true, errorMsg: 'Response Error when deleting Groups'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'Request Error when deleting Groups'};
    } else {
      return {error: true, errorMsg: 'Error when deleting Groups'};
    }
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
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'Not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'Missing Permissions for retrieving Groups'};
      } else {
        return {error: true, errorMsg: 'Response Error when retrieving Groups'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'Request Error when retrieving Groups'};
    } else {
      return {error: true, errorMsg: 'Error when retrieving Groups'};
    }
  }
}

export async function retrieveGroup(groupId: string):Promise<ErrorResult<Group>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${groupId}`);
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'Not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'Missing Permissions for retrieving a Group'};
      } else {
        return {error: true, errorMsg: 'Response Error when retrieving a Group'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'Request Error when retrieving a Group'};
    } else {
      return {error: true, errorMsg: 'Error when retrieving a Group'};
    }
  }
}
