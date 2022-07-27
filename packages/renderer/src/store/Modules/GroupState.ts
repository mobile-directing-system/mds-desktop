import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { createGroup, updateGroup, deleteGroup, retrieveGroup, retrieveGroups } from '#preload';
import type { Group, ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';

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
  groups: Group[] = [];
  page: Group[] = [];
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
  setPage(groups: Group[]) {this.state.page = groups;}
  setGroups(groups: Group[]) {this.state.groups = groups;}
  setTotal(total: number) {this.state.total = total;}
  addOrUpdateGroups(groups: Group[]) {
    groups.map((group) => {
      if (this.state.groups.filter((elem) => elem.id === group.id).length > 0) {
        this.state.groups = this.state.groups.map((elem) => (elem.id === group.id)? group : elem);
      } else {
        this.state.groups = [...this.state.groups, group];
      }
    });
  }
  addGroup(group: Group){this.state.groups = [...this.state.groups, group];}
  addOrUpdateGroup(group: Group) {
    if (this.state.groups.filter((elem) => elem.id === group.id).length > 0) {
      this.state.groups = this.state.groups.map((elem) => (elem.id === group.id)? group : elem);
    } else {
      this.state.groups = [...this.state.groups, group];
    }
  }
  updateGroup(group: Group){
    this.state.groups = this.state.groups.map((elem) => (elem.id === group.id)? group : elem);
  }
  deleteGroupById(groupId: string){this.state.groups = this.state.groups.filter((elem) => elem.id != groupId);}
}

/**
 * define actions for functions which change the state as a side effect.
 */
class GroupStateActions extends Actions<GroupState, GroupStateGetters, GroupStateMutations, GroupStateActions> {

  errorState: Context<typeof errorState> | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }
  async clearGroups() {
    this.mutations.setGroups([]);
    this.mutations.setPage([]);
  }
  async createGroup(group: Group) {
    const createdGroup:ErrorResult<Group> = await createGroup(undom(group));
    if(createdGroup.res && !createdGroup.error) {
      this.mutations.addGroup(createdGroup.res);
    }  else {
      handleErrors(createdGroup.error, createdGroup.errorMsg, this.errorState);
    }
  }
  async updateGroup(group: Group) {
    const groupUpdated:ErrorResult<boolean> = await updateGroup(undom(group));
    if(groupUpdated.res && !groupUpdated.error) {
      this.actions.retrieveGroupById(group.id);
    }  else {
      handleErrors(groupUpdated.error, groupUpdated.errorMsg, this.errorState);
    }
  }
  async deleteGroupById(groupId: string) {
    const groupDeleted:ErrorResult<boolean> = await deleteGroup(groupId);
    if(groupDeleted.res && !groupDeleted.error) {
      this.mutations.deleteGroupById(groupId);
    }  else {
      handleErrors(groupDeleted.error, groupDeleted.errorMsg, this.errorState);
    }
  }
  async retrieveGroups({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedGroups:ErrorResult<Group[]> = await retrieveGroups(amount, offset, orderBy, orderDir);
    if(retrievedGroups.res && retrievedGroups.total !== undefined && !retrievedGroups.error) {
      this.mutations.setPage(retrievedGroups.res);
      this.mutations.addOrUpdateGroups(retrievedGroups.res);
      this.mutations.setTotal(retrievedGroups.total);
    }  else {
      handleErrors(retrievedGroups.error, retrievedGroups.errorMsg, this.errorState);
    }
  }
  async retrieveGroupById(groupId: string) {
    const retrievedGroup:ErrorResult<Group> = await retrieveGroup(groupId);
    if(retrievedGroup.res && !retrievedGroup.error) {
      this.mutations.addOrUpdateGroup(retrievedGroup.res);
    }  else {
      handleErrors(retrievedGroup.error, retrievedGroup.errorMsg, this.errorState);
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
