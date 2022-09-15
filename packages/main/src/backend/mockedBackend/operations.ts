import type { User, Operation, ErrorResult } from '../../../../types';
import mockDB from './mockedDatabase';


export async function createOperation(operation: Operation):Promise<ErrorResult<Operation>> {
      try {
        return {error: false, res: mockDB.addOpertion(operation)};
      } catch {
        return {error: true, errorMsg: 'error when creating operations'};
      }
}

export async function updateOperation(operation: Operation):Promise<ErrorResult<boolean>> {
    try {
      return {error: false, res: mockDB.updateOperation(operation)};
    } catch {
      return {error: true, errorMsg: 'error when updating operations'};
    }
}

export async function retrieveOperations(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Operation[]>> {
  try {
    const allOperations = mockDB.getOperations();
    // cache length as the use of .splice changes the length of the array its called on
    const total = allOperations.length;
    // implements sorting
    if(order_by === 'title') {
      allOperations.sort((elem1, elem2) => elem1.title.localeCompare(elem2.title));
    } else if (order_by === 'description') {
      allOperations.sort((elem1, elem2) => {
        const desc1 = elem1.description? elem1.description : '';
        const desc2 = elem2.description? elem2.description : '';
        return desc1.localeCompare(desc2);
      });
    } else if (order_by === 'start') {
      allOperations.sort((elem1, elem2) => {
        if(!elem1.start) {
          return -1; // if the date does not exist on the first operation treat it as the lowest date possible
        }
        if(!elem2.start) {
          return 1; // if the date does not exist on the second operation treat it as the lowest date possible
        }
        // compare dates
        if(elem1.start < elem2.start) {
          return -1;
        } else if (elem1.start > elem2.start) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (order_by === 'end') {
      allOperations.sort((elem1, elem2) => {
        if(!elem1.end) {
          return -1; // if the date does not exist on the first operation treat it as the lowest date possible
        }
        if(!elem2.end) {
          return 1; // if the date does not exist on the second operation treat it as the lowest date possible
        }
        // compare dates
        if(elem1.end < elem2.end) {
          return -1;
        } else if (elem1.end > elem2.end) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (order_by === 'is_archived') {
      allOperations.sort((elem1, elem2) => {
        if(elem1.is_archived === elem2.is_archived) {
          return 0;
        } else if (elem1.is_archived) {
          return -1;
        } else {
          return 1;
        }
      });
    }
  
    //implement directrion
    if(order_dir === 'desc') {
      allOperations.reverse();
    }
  
    //implements amount and offset
    const res = allOperations.splice(offset? offset : 0, amount? amount : 20);
    return {error: false, res, total};
  } catch {
    return {error: true, errorMsg: 'error when retrieving operations'};
  }
}

export async function retrieveOperation(operationId: string):Promise<ErrorResult<Operation>> {
  try {
    return {error: false, res: mockDB.getOperation(operationId)};
  } catch {
    return {error: true, errorMsg: 'error when retrieving a operation'};
  }
}

export async function searchOperations(query: string, limit?: number, offset?: number): Promise<ErrorResult<Operation[]>> {
  try{
    return {error: false, res: mockDB.searchOperations(query, limit, offset)};
  } catch {
    return {error: true, errorMsg: 'error when searching operations'};
  }
}

export async function retrieveOperationMembers(operationId: string): Promise<ErrorResult<User[]>> {
  try {
    return {error: false, res: mockDB.getOperationMembers(operationId)};
  } catch {
    return {error: true, errorMsg: 'error when retrieving operation members'};
  }
}

export async function updateOperationMembers(operationId: string, memberIds: string[]): Promise<ErrorResult<boolean>> {
  try {
    return {error: false, res: mockDB.setOperationMembers(operationId, memberIds)};
  } catch {
    return {error: true, errorMsg: 'error when updating operation members'};
  }
}
