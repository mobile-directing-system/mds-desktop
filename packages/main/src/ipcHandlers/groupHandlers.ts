import type { IpcMainInvokeEvent } from 'electron';
import type { Group, ErrorResult } from '../../../types';
import { createGroup, updateGroup, deleteGroup, retrieveGroup, retrieveGroups } from '/@/backend';

/**
 * handler function for the backend {@link createGroup} function
 * @param _ event not used
 * @param group to be created
 * @returns the created group in an error result container
 */
export async function createGroupHandler(_:IpcMainInvokeEvent, group: Group):Promise<ErrorResult<Group>> {
    return createGroup(group);
}

/**
 * handler function for the backend {@link updateGroup} function
 * @param _ event not used
 * @param group to be updated
 * @returns boolean indicating if the update was successful in an error result container
 */
export async function updateGroupHandler(_:IpcMainInvokeEvent, group: Group):Promise<ErrorResult<boolean>> {
    return updateGroup(group);
}

/**
 * handler function for the backend {@link deleteGroup} function
 * @param _ event not used
 * @param groupId id of the group to be deleted
 * @returns boolean if the deletion was successful in an error result container
 */
export async function deleteGroupHandler(_:IpcMainInvokeEvent, groupId: string):Promise<ErrorResult<boolean>> {
  return deleteGroup(groupId);
}

/**
 * handler function for the backend {@link retrieveGroups} function
 * @param _ event not used
 * @param amount of groups to be retrieved
 * @param offset at which to begin retrieving groups
 * @param order_by group property to sort the result by
 * @param order_dir in which to sort the results ('asc' or 'desc')
 * @returns retrieved groups in an error result container
 */
export async function retrieveGroupsHandler(_:IpcMainInvokeEvent, amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Group[]>> {
    return retrieveGroups(amount, offset, order_by, order_dir);
}

/**
 * handler function for the backend {@link retrieveGroup} function
 * @param _ event not used
 * @param groupId id of the group to be retrieved
 * @returns the retrieved group in an error result container
 */
export async function retrieveGroupHandler(_:IpcMainInvokeEvent, groupId: string):Promise<ErrorResult<Group>> {
    return retrieveGroup(groupId);
}