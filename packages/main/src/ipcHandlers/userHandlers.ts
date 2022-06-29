import type { IpcMainInvokeEvent } from 'electron';
import type { User, CachedResult } from '../../../types';
import { createUser, deleteUser, retrieveUser, retrieveUsers, updateUser, updateUserPassword } from '/@/backend';

// eslint-disable-next-line no-unused-vars
export async function createUserHandler(_:IpcMainInvokeEvent, user:User):Promise<CachedResult<User>> {
  return createUser(user);
}

// eslint-disable-next-line no-unused-vars
export async function updateUserHandler(_:IpcMainInvokeEvent, user:User):Promise<CachedResult<User>> {
  return updateUser(user);
}

// eslint-disable-next-line no-unused-vars
export async function updateUserPasswordHandler(_:IpcMainInvokeEvent, userId: string, newPass: string):Promise<CachedResult<User>> {
  return updateUserPassword(userId, newPass);
}

// eslint-disable-next-line no-unused-vars
export async function deleteUserHandler(_:IpcMainInvokeEvent, userId: string):Promise<CachedResult<User>> {
  return deleteUser(userId);
}

// eslint-disable-next-line no-unused-vars
export async function retrieveUsersHandler(_:IpcMainInvokeEvent, amount?: number, offset?: number, orderBy?:string, orderDir?: string):Promise<CachedResult<User[]>> {
  return retrieveUsers(amount, offset, orderBy, orderDir);
}

// eslint-disable-next-line no-unused-vars
export async function retrieveUserHandler(_:IpcMainInvokeEvent, userId: string):Promise<CachedResult<User>> {
  return retrieveUser(userId);
}