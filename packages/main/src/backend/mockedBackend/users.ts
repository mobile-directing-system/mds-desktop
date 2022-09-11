/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User, ErrorResult } from '../../../../types';
import mockDB from './mockedDatabase';



export async function createUser(user: User):Promise<ErrorResult<User>> {
  return {error: true, errorMsg: 'error when creating user'};
}


export async function updateUser(user: User):Promise<ErrorResult<boolean>> {
  return {error: true, errorMsg: 'error when updating users'};
}

export async function updateUserPassword(user_id: string, new_pass: string):Promise<ErrorResult<boolean>> {
  return {error: true, errorMsg: 'error when updating user passwords'};
}

export async function deleteUser(userId: string):Promise<ErrorResult<boolean>> {
  return {error: true, errorMsg: 'error when deleting users'};
}

export async function retrieveUsers(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<User[]>> {
  const allUsers = mockDB.getUsers();
  const users = allUsers.splice(offset? offset : 0, amount? amount : 20);
  
  try {
    return {error: false, res: users, total: allUsers.length};
  } catch {
    return {error: true, errorMsg: 'error when retrieving users'};
  }
}

export async function retrieveUser(userId: string):Promise<ErrorResult<User>> {
  return {error: true, errorMsg: 'error when retrieving a user'};
}

export async function searchUsers(query: string, limit?: number, offset?: number): Promise<ErrorResult<User[]>> {
  return {error: true, errorMsg: 'error when searching users'};
}
