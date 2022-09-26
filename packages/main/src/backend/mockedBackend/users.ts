/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User, ErrorResult } from '../../../../types';
import mockDB from './mockedDatabase';



export async function createUser(user: User):Promise<ErrorResult<User>> {
  try {
    return {error: false, res: mockDB.addUser(user)};
  } catch {
    return {error: true, errorMsg: 'error when creating user'};
  }
}


export async function updateUser(user: User):Promise<ErrorResult<boolean>> {
  try {
    return {error: false, res: mockDB.updateUser(user)};
  } catch {
    return {error: true, errorMsg: 'error when updating users'};
  }
}

export async function updateUserPassword(user_id: string, new_pass: string):Promise<ErrorResult<boolean>> {
  try {
    return {error: false, res: mockDB.updateUserPassword(user_id, new_pass)};
  } catch {
    return {error: true, errorMsg: 'error when updating user passwords'};
  }
}

export async function deleteUser(userId: string):Promise<ErrorResult<boolean>> {
  try {
    return {error: false, res: true};
  } catch {
    return {error: true, errorMsg: 'error when deleting users'};
  }
}

export async function retrieveUsers(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<User[]>> {
  try {
    const allUsers = mockDB.getUsers();
    // cache length as the use of .splice changes the length of the array its called on
    const total = allUsers.length;
    // implements sorting
    if(order_by === 'username') {
      allUsers.sort((elem1, elem2) => elem1.username.localeCompare(elem2.username));
    } else if (order_by === 'first_name') {
      allUsers.sort((elem1, elem2) => elem1.first_name.localeCompare(elem2.last_name));
    } else if (order_by === 'last_name') {
      allUsers.sort((elem1, elem2) => elem1.last_name.localeCompare(elem2.last_name));
    } else if (order_by === 'is_admin') {
      allUsers.sort((elem1, elem2) => {
        if(elem1.is_admin === elem2.is_admin) {
          return 0;
        } else if (elem1.is_admin) {
          return -1;
        } else {
          return 1;
        }
      });
    }
  
    //implement directrion
    if(order_dir === 'desc') {
      allUsers.reverse();
    }
  
    //implements amount and offset
    const res = allUsers.splice(offset? offset : 0, amount? amount : 20);
    return {error: false, res, total};
  } catch {
    return {error: true, errorMsg: 'error when retrieving users'};
  }
}

export async function retrieveUser(userId: string):Promise<ErrorResult<User>> {
  try {
    if(mockDB.userExists(userId)) {
      return {error: false, res: mockDB.getUser(userId)};
    } else {
      throw new Error();
    }
  } catch {
    return {error: true, errorMsg: 'error when retrieving a user'};
  }
}

export async function searchUsers(query: string, limit?: number, offset?: number): Promise<ErrorResult<User[]>> {
  try {
    return {error: false, res: mockDB.searchUsers(query, limit, offset)};
  } catch {
    return {error: true, errorMsg: 'error when searching users'};
  }
}
