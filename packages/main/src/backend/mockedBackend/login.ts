import type { ErrorResult } from '../../../../types';
import mockDB from './mockedDatabase';

export async function login(username: string, password: string):Promise<ErrorResult<string>> {
  try {
    if(mockDB.login(username, password)) {
      return {res: mockDB.getUserByUsername(username).id, error: false};
    } else {
      return {error: true, errorMsg: 'login failed'};
    }
  } catch (error) {
    return {error: true, errorMsg: 'Error when logging in'};
  }
}

export async function logout():Promise<ErrorResult<boolean>> {
  return {res: true, error: false};
}