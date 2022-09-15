import type { Permissions, ErrorResult } from '../../../../types';
import mockDB from './mockedDatabase';

export async function retrievePermissions(userId: string):Promise<ErrorResult<Permissions>> {
  try {
    return {error: false, res: mockDB.getPermissions(userId)};
  } catch {
    return {error: true, errorMsg: 'error when updating retrieving permissions'};
  }
}

export async function updatePermissions(userId: string, permissions: Permissions):Promise<ErrorResult<boolean>> {
  try {
    return {error: false, res: mockDB.setPermissions(userId, permissions)};
  } catch {
    return {error: true, errorMsg: 'error when updating permissions'};
  }
}