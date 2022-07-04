import type { IpcMainInvokeEvent } from 'electron';
import type { User, ErrorResult } from '../../../types';
import { createUser, deleteUser, retrieveUser, retrieveUsers, updateUser, updateUserPassword } from '/@/backend';

/**
 * handler function to call backend createUser function
 * @param _ event not used
 * @param user user to be created
 * @returns created user in error result container
 */
// eslint-disable-next-line no-unused-vars
export async function createUserHandler(_:IpcMainInvokeEvent, user:User):Promise<ErrorResult<User>> {
  return createUser(user);
}

/**
 * handler function to call backend updateUser function
 * @param _ event not used
 * @param user user to be updated
 * @returns boolean indicating if the user was updated in error result container
 */
// eslint-disable-next-line no-unused-vars
export async function updateUserHandler(_:IpcMainInvokeEvent, user:User):Promise<ErrorResult<boolean>> {
  return updateUser(user);
}

/**
 * handler function to call backend updateUserPassword function
 * @param _ event not used
 * @param userId  id of user for which to change password
 * @param newPass password to change to
 * @returns boolean indicating if the user password was updated boolean in error result container
 */
// eslint-disable-next-line no-unused-vars
export async function updateUserPasswordHandler(_:IpcMainInvokeEvent, userId: string, newPass: string):Promise<ErrorResult<boolean>> {
  return updateUserPassword(userId, newPass);
}

/**
 * handler function to call backend deleteUser function
 * @param _ event not used
 * @param userId  id of user to delete
 * @returns boolean indicating if the user was deleted in error result container
 */
// eslint-disable-next-line no-unused-vars
export async function deleteUserHandler(_:IpcMainInvokeEvent, userId: string):Promise<ErrorResult<boolean>> {
  return deleteUser(userId);
}

/**
 * handler function to call backend retrieveUsers function
 * @param _ event not used
 * @param amount optional number indicating the maxmimal amount of users to return
 * @param offset optional number indicating the offset starting from which users should be return
 * @param orderBy optional string indicating by which field the users should be sorted
 * @param orderDir optional string (either 'desc' or 'asc') indicating if the sorting should be descending or ascending
 * @returns received users in error result container
 */
// eslint-disable-next-line no-unused-vars
export async function retrieveUsersHandler(_:IpcMainInvokeEvent, amount?: number, offset?: number, orderBy?:string, orderDir?: string):Promise<ErrorResult<User[]>> {
  return retrieveUsers(amount, offset, orderBy, orderDir);
}

/**
 * handler function to call backend retrieveUser function
 * @param _ event not used
 * @param userId id of user to be retrieved
 * @returns retrieved user in error result conatiner
 */
// eslint-disable-next-line no-unused-vars
export async function retrieveUserHandler(_:IpcMainInvokeEvent, userId: string):Promise<ErrorResult<User>> {
  return retrieveUser(userId);
}