import type { Permission, ErrorResult } from '../../../../types';
import mockDB from './mockedDatabase';

export async function retrievePermissions(userId: string):Promise<ErrorResult<Permission[]>> {
  try {
    return {error: false, res: mockDB.getPermissions(userId)};
  } catch {
    return {error: true, errorMsg: 'error when updating retrieving permissions'};
  }
}

export async function updatePermissions(userId: string, permissions: Permission[]):Promise<ErrorResult<boolean>> {
  try {
    return {error: false, res: mockDB.setPermissions(userId, permissions)};
  } catch {
    return {error: true, errorMsg: 'error when updating permissions'};
  }
}