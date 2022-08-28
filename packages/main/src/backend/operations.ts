import type { AxiosError } from 'axios';
import type { User, Operation, ErrorResult } from '../../../types';
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
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for creating operations'};
      } else {
        return {error: true, errorMsg: 'response error when creating operations'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when creating operations'};
    } else {
      return {error: true, errorMsg: 'error when creating operations'};
    }
  }
}

export async function updateOperation(operation: Operation):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${operation.id}`, operation);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for updating operations'};
      } else {
        return {error: true, errorMsg: 'response error when updating operations'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when updating operations'};
    } else {
      return {error: true, errorMsg: 'error when updating operations'};
    }
  }
}

export async function retrieveOperations(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Operation[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/?${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''}`);
    return {res: response.data.entries.map((elem:{id: string, title: string, description: string, start: string, end: string, is_archived: boolean}) => {
      return { ...elem, start: new Date(elem.start), end: new Date(elem.end) };
    }), total: response.data.total, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for retrieving operations'};
      } else {
        return {error: true, errorMsg: 'response error when retrieving operations'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when retrieving operations'};
    } else {
      return {error: true, errorMsg: 'error when retrieving operations'};
    }
  }
}

export async function retrieveOperation(operationId: string):Promise<ErrorResult<Operation>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${operationId}`);
    return {res: {...response.data, start: new Date(response.data.start), end: new Date(response.data.end) }, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for retrieving a operation'};
      } else {
        return {error: true, errorMsg: 'response error when retrieving a operation'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when retrieving a operation'};
    } else {
      return {error: true, errorMsg: 'error when retrieving a operation'};
    }
  }
}

export async function searchOperations(query: string, limit?: number, offset?: number): Promise<ErrorResult<Operation[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/search?${(query != null)? `&q=${query}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(limit != null)? `&limit=${limit}` : ''}`);
    return {res: response.data.hits, total: response.data.estimated_total_hits , error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for searching operations'};
      } else {
        return {error: true, errorMsg: 'response error when searching operations'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when searching operations'};
    } else {
      return {error: true, errorMsg: 'error when searching operations'};
    }
  }
}

export async function retrieveOperationMembers(operationId: string): Promise<ErrorResult<User[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/${operationId}/members`);
    return {res: response.data, total: response.data.total , error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for retrieving operation members'};
      } else {
        return {error: true, errorMsg: 'response error when retrieving operation members'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when retrieving operation members'};
    } else {
      return {error: true, errorMsg: 'error when retrieving operation members'};
    }
  }
}

export async function updateOperationMembers(operationId: string, memberIds: string[]): Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${operationId}/members`, memberIds);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    if(axError.response) {
      if(axError.response.status === 401) {
        return {error: true, errorMsg: 'not authenticated'};
      } else if(axError.response.status === 403) {
        return {error: true, errorMsg: 'missing permissions for updating operation members'};
      } else {
        return {error: true, errorMsg: 'response error when updating operation members'};
      }
    } else if(axError.request) {
      return {error: true, errorMsg: 'request error when updating operation members'};
    } else {
      return {error: true, errorMsg: 'error when updating operation members'};
    }
  }
}
