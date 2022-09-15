import type { ErrorResult } from '../../../../types';
import mockDB from './mockedDatabase';

export async function login(username: string, password: string):Promise<ErrorResult<boolean>> {
  if(mockDB.login(username, password)) {
    return {res: true, error: false};
  } else {
    return {error: true, errorMsg: 'login failed'};
  }
}

export async function logout():Promise<ErrorResult<boolean>> {
  return {res: true, error: false};
}