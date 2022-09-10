import type { ErrorResult } from '../../../../types';

export async function login(username: string, password: string):Promise<ErrorResult<boolean>> {
  if(username === 'admin1' && password === 'admin1') {
    return {res: true, error: false};
  } else {
    return {error: true, errorMsg: 'login failed'};
  }
}

export async function logout():Promise<ErrorResult<boolean>> {
  return {res: true, error: false};
}