import type { IpcMainInvokeEvent } from 'electron';
import type { Group, ErrorResult } from '../../../types';
import { createGroup, updateGroup, deleteGroup, retrieveGroup, retrieveGroups } from '/@/backend';

export async function createGroupHandler(_:IpcMainInvokeEvent, group: Group):Promise<ErrorResult<Group>> {
    return createGroup(group);
}

export async function updateGroupHandler(_:IpcMainInvokeEvent, group: Group):Promise<ErrorResult<boolean>> {
    return updateGroup(group);
}

export async function deleteGroupHandler(_:IpcMainInvokeEvent, groupId: string):Promise<ErrorResult<boolean>> {
  return deleteGroup(groupId);
}

export async function retrieveGroupsHandler(_:IpcMainInvokeEvent, amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Group[]>> {
    return retrieveGroups(amount, offset, order_by, order_dir);
}

export async function retrieveGroupHandler(_:IpcMainInvokeEvent, groupId: string):Promise<ErrorResult<Group>> {
    return retrieveGroup(groupId);
}