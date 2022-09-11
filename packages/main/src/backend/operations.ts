import type { AxiosError } from 'axios';
import type { User, Operation, ErrorResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/operations';

/**
 * call the /operations endpoint to create an operation
 * @param operation operation to create
 * @returns the created operation
 */
export async function createOperation(operation: Operation):Promise<ErrorResult<Operation>> {
  try {
    const response = await Backend.instance.post(`${endpoint}`, {...operation, id: undefined});
    return {res: {...response.data, start: response.data.start? new Date(response.data.start) : undefined, end: response.data.end? new Date(response.data.end) :undefined }, error: false};
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

/**
 * call the /operation endpoint to update an operation
 * @param operation operation to update
 * @returns boolean indicating if the update of the operation was successful
 */
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

/**
 * call to the /operations endpoint to retrieve a number of operations
 * @param amount the amount of operations to be retrieved
 * @param offset the offset at which to begin retrieving the operations
 * @param order_by the operations property by which to sort the result
 * @param order_dir the direction ('asc' or 'desc') in which to sort
 * @returns  retrieved operations in the form of an operations array
 */
export async function retrieveOperations(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Operation[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/?${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''}`);    return {res: response.data.entries.map((elem:{id: string, title: string, description: string, start: string, end: string, is_archived: boolean}) => {
      return { ...elem, start: elem.start? new Date(elem.start) : undefined, end: elem.end? new Date(elem.end) : undefined };
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

/**
 * call to the /operations backend to retrieve a single operation
 * @param operationId the id of the operation to be retrieved
 * @returns the recieved operation
 */
export async function retrieveOperation(operationId: string):Promise<ErrorResult<Operation>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${operationId}`);
    return {res: {...response.data, start: response.data.start? new Date(response.data.start) : undefined, end: response.data.end? new Date(response.data.end) : undefined }, error: false};
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

/**
 * call to the /operations/search endpoint to search for operations
 * @param query the query to search for operations with
 * @param limit the maximum amount of search results to be returned
 * @param offset the offset at which to begin the search
 * @returns 
 */
export async function searchOperations(query: string, limit?: number, offset?: number): Promise<ErrorResult<Operation[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/search?${(query != null)? `&q=${query}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(limit != null)? `&limit=${limit}` : ''}`);
    return {res: response.data.hits.map((elem:{id: string, title: string, description: string, start: string, end: string, is_archived: boolean}) => {
      return { ...elem, start: elem.start? new Date(elem.start) : undefined, end: elem.end? new Date(elem.end) : undefined };
    }), total: response.data.estimated_total_hits , error: false};
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

/**
 * call to the /operations/#operationId/members endpoint to get the members of an operation
 * @param operationId the id for which to retrieve the operation members
 * @returns the retrieved operation members in the form of a user array
 */
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

/**
 * call to the /operations/#operationId/members endpoint to set the operations members
 * @param operationId id of the operation for which to set the members
 * @param memberIds the array of member ids the operation members should be set to
 * @returns boolean indicating if the setting of the members was successful
 */
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
