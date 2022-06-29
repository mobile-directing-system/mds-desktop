import type { AxiosError } from 'axios';
import type { User, CachedResult } from '../../../types';
import Backend from './backendInstance';
import { printAxiosError } from './backendInstance';

const endpoint = '/users';

export async function createUser({username, first_name, last_name, is_admin, pass}: User):Promise<CachedResult<User>> {
  try {
    const response = await Backend.instance.post(`${endpoint}`, {
      username,
      first_name,
      last_name,
      is_admin,
      pass,
    });
    //return {user: response.data, cached: false, success: true};
    return {res: response.data, cached: false, success: true};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, success: false};
  }
}

export async function updateUser({id, username, first_name, last_name, is_admin}: User):Promise<CachedResult<User>> {
  try {
    await Backend.instance.put(`${endpoint}/${id}`, {
      id,
      username,
      first_name,
      last_name,
      is_admin,
    });
    return {cached: false, success: true};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, success: false};
  }
}

export async function updateUserPassword(user_id: string, new_pass: string):Promise<CachedResult<User>> {
  try {
    await Backend.instance.put(`${endpoint}/${user_id}/pass`, {
      user_id,
      new_pass,
    });
    return {cached: false, success: true};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, success: false};
  }
}

export async function deleteUser(user_id: string):Promise<CachedResult<User>> {
  try {
    await Backend.instance.delete(`${endpoint}/${user_id}`);
    return {cached: false, success: true};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, success: false};
  }
}

export async function retrieveUsers(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<CachedResult<User[]>> {
  try {
    //explicit use of != instead of !== as a != null is equivalent to a !== null | a !== undefined
    const response = await Backend.instance.get(`${endpoint}/?${(amount != null)? `&limit=${amount}` : ''}${(offset != null)? `&offset=${offset}` : ''}${(order_by != null)? `&order_by=${order_by}` : ''}${(order_dir != null)? `&order_dir=${order_dir}` : ''}`);
    return {res: response.data.entries, cached: false, success: true};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, success: false};
  }
}

export async function retrieveUser(user_id: string):Promise<CachedResult<User>> {
  try {
    const response = await Backend.instance.get(`${endpoint}/${user_id}`);
    return {res: response.data, cached: false, success: true};
  } catch(error) {
    const axError: AxiosError = error as AxiosError;
    printAxiosError(axError);
    return {cached: false, success: false};
  }
}
