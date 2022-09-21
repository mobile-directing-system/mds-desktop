import type { ErrorResult } from '../../../../types';
import mockDB from './mockedDatabase';

export async function login(username: string, password: string):Promise<ErrorResult<string>> {
  if(mockDB.login(username, password)) {
    return {res: mockDB.getUsers().filter((elem) => elem.username === username)[0].id, error: false};
  } else {
    return {error: true, errorMsg: 'login failed'};
  }
}

export async function logout():Promise<ErrorResult<boolean>> {
  return {res: true, error: false};
}