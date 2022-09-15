import type { Group, ErrorResult } from '../../../../types';
import mockDB from './mockedDatabase';

export async function createGroup(group: Group):Promise<ErrorResult<Group>> {
  try {
    return {error: false, res: mockDB.addGroup(group)};
  } catch {
    return {error: true, errorMsg: 'error when creating groups'};
  }
}

export async function updateGroup(group: Group):Promise<ErrorResult<boolean>> {
  try {
    return {error: false, res: mockDB.updateGroup(group)};
  } catch {
    return {error: true, errorMsg: 'error when updating groups'};
  }
}

export async function deleteGroup(groupId: string):Promise<ErrorResult<boolean>> {
  try{
    return {error: false, res: mockDB.deleteGroup(groupId)};
  } catch {
    return {error: true, errorMsg: 'error when deleting groups'};
  }
}

export async function retrieveGroups(amount?: number, offset?: number, order_by?: string, order_dir?: string):Promise<ErrorResult<Group[]>> {
  try {
    const allGroups = mockDB.getGroups();
    // cache length as the use of .splice changes the length of the array its called on
    const total = allGroups.length;
    // implements sorting
    if(order_by === 'title') {
      allGroups.sort((elem1, elem2) => elem1.title.localeCompare(elem2.title));
    } else if (order_by === 'description') {
      allGroups.sort((elem1, elem2) => {
        const desc1 = elem1.description? elem1.description : '';
        const desc2 = elem2.description? elem2.description : '';
        return desc1.localeCompare(desc2);
      });
    }
  
    //implement directrion
    if(order_dir === 'desc') {
      allGroups.reverse();
    }
  
    //implements amount and offset
    const res = allGroups.splice(offset? offset : 0, amount? amount : 20);
    return {error: false, res, total};
  } catch {
    return {error: true, errorMsg: 'error when retrieving groups'};
  }
}

export async function retrieveGroup(groupId: string):Promise<ErrorResult<Group>> {
  try {
    return {error: false, res: mockDB.getGroup(groupId)};
  } catch {
    return {error: true, errorMsg: 'error when retrieving a group'};
  }
}
