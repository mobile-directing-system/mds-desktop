import type { AxiosError } from 'axios';
import type { User, ErrorResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/users';

/**
 * call to the /users endpoint to create a new user
 * @param param0 user to create
 * @returns created user in error result container
 */
export async function createUser(user: User):Promise<ErrorResult<User>> {
  try {
    const response = await Backend.instance.post(`${endpoint}`, {...user, id: undefined});
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

/**
 * call to the /users endpoint to update a user
 * @param param0 updated user
 * @returns boolean indicating if the user was updated in error result container
 */
export async function updateUser(user: User):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${user.id}`, {...user, pass: undefined});
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

/**
 * call to the /users endpoint to change a user password
 * @param user_id id of user for which to change password
 * @param new_pass pass word to change to
 * @returns boolean indicating if the user password was changed in error result container
 */
export async function updateUserPassword(user_id: string, new_pass: string):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${user_id}/pass`, {
      user_id,
      new_pass,
    });
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

/**
 * call to the /users endpoint to delete a user
 * @param user_id of the user to delete
 * @returns boolean indicating if the user was deleted in a error results container
 */
export async function deleteUser(userId: string):Promise<ErrorResult<boolean>> {
  try {
    await Backend.instance.delete(`${endpoint}/${userId}`);
    return {res: true, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

/**
 * call to the /users endpoint to retrieve a collection of users
 * @param amount optional number indicating the maxmimal amount of users to return
 * @param offset optional number indicating the offset starting from which users should be return
 * @param order_by optional string indicating by which field the users should be sorted
 * @param order_dir optional string (either 'desc' or 'asc') indicating if the sorting should be descending or ascending
 * @returns received collection of users in a error result container
 */
export async function retrieveUsers(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<User[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/?${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''}`);
    return {res: response.data.entries, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}

/**
 * call to the /users endpoint to retrieve a user
 * @param user_id id of the user to be retrieved
 * @returns received user in a error result container
 */
export async function retrieveUser(userId: string):Promise<ErrorResult<User>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${userId}`);
    return {res: response.data, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {error: true};
  }
}
