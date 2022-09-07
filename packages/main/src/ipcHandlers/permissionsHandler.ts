import type { IpcMainInvokeEvent } from 'electron';
import type { Permissions, ErrorResult } from '../../../types';
import { retrievePermissions, updatePermissions } from '/@/backend';

/**
 * handler function to call the backend {@link retrievePermissions} function
 * @param _ event not used
 * @param userId id of the user for which to retrieve the permissions
 * @returns the permissions for the user in an error result container
 */
export async function retrievePermissionsHandler(_:IpcMainInvokeEvent, userId: string):Promise<ErrorResult<Permissions>> {
  return retrievePermissions(userId);
}

/**
 * handler function to call the backend {@link updatePermissions} function
 * @param _ event not used
 * @param userId id of the user for which to set the permissions
 * @param permissions the permissions which should be set
 * @returns boolean indicating if the update of the permissions was successful in an error result container 
 */
export async function updatePermissionsHandler(_:IpcMainInvokeEvent, userId: string, permissions: Permissions):Promise<ErrorResult<boolean>> {
  return updatePermissions(userId, permissions);
}