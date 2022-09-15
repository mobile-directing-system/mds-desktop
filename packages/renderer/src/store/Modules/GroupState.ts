import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { createGroup, updateGroup, deleteGroup, retrieveGroup, retrieveGroups } from '#preload';
import type { Group, ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';

/**
 * function to create a deep enough copy of a group object to be able to pass through the IPC
 * @param group group object to be undomed
 * @returns a relatively deep copy of the group object
 */
function undom(group: Group):Group {
  return {
    ...group,
    members: [...group.members],
  };
}

/**
 * define the content of the LoginInfoState
 */
class GroupState {
  groups: Map<string, Group> = new Map<string, Group>();
  page: Map<string, Group> = new Map<string, Group>();
  total = 0;
}

/**
 * define getters to access the state
 */
class GroupStateGetters extends Getters<GroupState> {
  get groups() {
    return () => {
      return this.state.groups;
    };
  }
  get page() {
    return () => {
      return this.state.page;
    };
  }
  get total() {
    return() => {
      return this.state.total;
    };
  }
}

/**
 * define mutations to change the state
 */
class GroupStateMutations extends Mutations<GroupState> {
  /**
   * Mutation to set the page (clear the previous page)
   * @param groups groups to set the page state to 
   */
  setPage(groups: Group[]) {
    this.state.page.clear();
    groups.forEach((elem) => this.state.page.set(elem.id, elem));
  }
  /**
   * Mutation to set the groups (clear the previous groups)
   * @param groups groups to set the groups state to
   */
  setGroups(groups: Group[]) {
    this.state.groups.clear();
    groups.forEach((elem) => this.state.groups.set(elem.id, elem));
  }
  /**
   * Mutation to set the total available groups
   * @param total number to set the total state to
   */
  setTotal(total: number) {this.state.total = total;}
  /**
   * Mutation to add or update groups, if they exist, in the groups state
   * @param groups groups to be added or updated in the groups state
   */
  addOrUpdateGroups(groups: Group[]) {
    groups.forEach((elem) => this.state.groups.set(elem.id, elem));
  }
  /**
   * Mutatiion to add or update a single group, if it exists, in the groups state
   * @param group group to be added or updated in the groups state
   */
  addOrUpdateGroup(group: Group) {
    this.state.groups.set(group.id, group);
  }
  /**
   * Mutation to delete the group from the group state by id
   * @param groupId id of the group to be removed
   */
  deleteGroupById(groupId: string){
    this.state.groups.delete(groupId);
  }
}

/**
 * define actions for functions which change the state as a side effect.
 */
class GroupStateActions extends Actions<GroupState, GroupStateGetters, GroupStateMutations, GroupStateActions> {

  //reference to the error state to be able to add errors
  errorState: Context<typeof errorState> | undefined;

  // set error state on init of the store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }
  /**
   * Action to clear the groups state and page state
   */
  async clearGroups() {
    this.mutations.setGroups([]);
    this.mutations.setPage([]);
  }
  /**
   * Action to create a group in the backend and add it to the groups state
   * @param group group to be created
   */
  async createGroup(group: Group) {
    const createdGroup:ErrorResult<Group> = await createGroup(undom(group));
    if(createdGroup.res && !createdGroup.error) {
      this.mutations.addOrUpdateGroup(createdGroup.res);
    }  else {
      handleErrors(createdGroup.errorMsg, this.errorState);
    }
  }
  /**
   * Action to update a group in the backend and retrieve it again to be up to date
   * @param group group to be updated
   */
  async updateGroup(group: Group) {
    const groupUpdated:ErrorResult<boolean> = await updateGroup(undom(group));
    if(groupUpdated.res && !groupUpdated.error) {
      this.actions.retrieveGroupById(group.id);
    }  else {
      handleErrors(groupUpdated.errorMsg, this.errorState);
    }
  }
  /**
   * Action to delete a group in the backend by its id
   * @param groupId id of the group to be deleted
   */
  async deleteGroupById(groupId: string) {
    const groupDeleted:ErrorResult<boolean> = await deleteGroup(groupId);
    if(groupDeleted.res && !groupDeleted.error) {
      this.mutations.deleteGroupById(groupId);
    }  else {
      handleErrors(groupDeleted.errorMsg, this.errorState);
    }
  }
  /**
   * Action to retrieve a number of groups from the backend and add it to the groups state, page state and total state
   * @param param0 {amount, offset, orderBy, orderDir} amount is number of groups retrieved, offset is where the
   *                                                   retrieval of groups starts, orderBy is the group property
   *                                                   to use for sorting and orderDir is the direction of the sorting
   */
  async retrieveGroups({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedGroups:ErrorResult<Group[]> = await retrieveGroups(amount, offset, orderBy, orderDir);
    if(retrievedGroups.res && retrievedGroups.total !== undefined && !retrievedGroups.error) {
      this.mutations.setPage(retrievedGroups.res);
      this.mutations.addOrUpdateGroups(retrievedGroups.res);
      this.mutations.setTotal(retrievedGroups.total);
    }  else {
      handleErrors(retrievedGroups.errorMsg, this.errorState);
    }
  }
  /**
   * Action to retrieve a single group by its id from the backend and add it to the groups state
   * @param groupId id of the group to be retrieved
   */
  async retrieveGroupById(groupId: string) {
    const retrievedGroup:ErrorResult<Group> = await retrieveGroup(groupId);
    if(retrievedGroup.res && !retrievedGroup.error) {
      this.mutations.addOrUpdateGroup(retrievedGroup.res);
    }  else {
      handleErrors(retrievedGroup.errorMsg, this.errorState);
    }
  }
}

/**
 * generate a Module based on the state, getters, mutations and actions
 */
export const groupState = new Module({
  state: GroupState,
  getters: GroupStateGetters,
  mutations: GroupStateMutations,
  actions: GroupStateActions,
});

/**
 * export a composable function to be able to use this module in .vue files
 */
export const useGroupState = createComposable(groupState);
