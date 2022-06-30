import type { AxiosError } from 'axios';
import type { User, CachedResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/users';

/**
 * call to the /users endpoint to create a new user
 * @param param0 user to create
 * @returns created user in cached result container
 */
export async function createUser({username, first_name, last_name, is_admin, pass}: User):Promise<CachedResult<User>> {
  try {
    const response = await Backend.instance.post(`${endpoint}`, {
      username,
      first_name,
      last_name,
      is_admin,
      pass,
    });
    return {res: response.data, cached: false, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, error: true};
  }
}

/**
 * call to the /users endpoint to update a user
 * @param param0 updated user
 * @returns boolean indicating if the user was updated in cached container
 */
export async function updateUser({id, username, first_name, last_name, is_admin}: User):Promise<CachedResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${id}`, {
      id,
      username,
      first_name,
      last_name,
      is_admin,
    });
    return {res: true, cached: false, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, error: true};
  }
}

/**
 * call to the /users endpoint to change a user password
 * @param user_id id of user for which to change password
 * @param new_pass pass word to change to
 * @returns boolean indicating if the user password was changed in cached container
 */
export async function updateUserPassword(user_id: string, new_pass: string):Promise<CachedResult<boolean>> {
  try {
    await Backend.instance.put(`${endpoint}/${user_id}/pass`, {
      user_id,
      new_pass,
    });
    return {res: true, cached: false, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, error: true};
  }
}

/**
 * call to the /users endpoint to delete a user
 * @param user_id of the user to delete
 * @returns boolean indicating if the user was deleted in a cached container
 */
export async function deleteUser(user_id: string):Promise<CachedResult<boolean>> {
  try {
    await Backend.instance.delete(`${endpoint}/${user_id}`);
    return {res: true, cached: false, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, error: true};
  }
}

export async function retrieveUsers(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<CachedResult<User[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/?${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''}`);
    return {res: response.data.entries, cached: false, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, error: true};
  }
}

export async function retrieveUser(user_id: string):Promise<CachedResult<User>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${user_id}`);
    return {res: response.data, cached: false, error: false};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, error: true};
  }
}
