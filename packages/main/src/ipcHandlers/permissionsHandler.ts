import type { IpcMainInvokeEvent } from 'electron';
import type { Permissions, ErrorResult } from '../../../types';
import { retrievePermissions, updatePermissions } from '/@/backend';

export async function retrievePermissionsHandler(_:IpcMainInvokeEvent, userId: string):Promise<ErrorResult<Permissions>> {
  return retrievePermissions(userId);
}

export async function updatePermissionsHandler(_:IpcMainInvokeEvent, userId: string, permissions: Permissions):Promise<ErrorResult<boolean>> {
  return updatePermissions(userId, permissions);
}