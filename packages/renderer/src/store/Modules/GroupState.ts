import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { createGroup, updateGroup, deleteGroup, retrieveGroup, retrieveGroups } from '#preload';
import type { Group, ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState } from './ErrorState';

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
}

/**
 * define mutations to change the state
 */
class GroupStateMutations extends Mutations<GroupState> {
  setGroups(groups: Group[]) {this.state.groups = groups;}
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

  async createGroup(group: Group) {
    const createdGroup:ErrorResult<Group> = await createGroup(undom(group));
    if(createdGroup.res && !createdGroup.error) {
      this.mutations.addGroup(createdGroup.res);
    } else if(this.errorState) {
      this.errorState.actions.setError(createdGroup.error);
      if(createdGroup.errorMsg) {
        this.errorState.actions.setErrorMessage(createdGroup.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async updateGroup(group: Group) {
    const groupUpdated:ErrorResult<boolean> = await updateGroup(undom(group));
    if(groupUpdated.res && !groupUpdated.error) {
      this.actions.retrieveGroupById(group.id);
    } else if(this.errorState) {
      this.errorState.actions.setError(groupUpdated.error);
      if(groupUpdated.errorMsg) {
        this.errorState.actions.setErrorMessage(groupUpdated.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async deleteGroupById(groupId: string) {
    const groupDeleted:ErrorResult<boolean> = await deleteGroup(groupId);
    if(groupDeleted.res && !groupDeleted.error) {
      this.mutations.deleteGroupById(groupId);
    } else if(this.errorState) {
      this.errorState.actions.setError(groupDeleted.error);
      if(groupDeleted.errorMsg) {
        this.errorState.actions.setErrorMessage(groupDeleted.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async retrieveGroups({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedGroups:ErrorResult<Group[]> = await retrieveGroups(amount, offset, orderBy, orderDir);
    if(retrievedGroups.res && !retrievedGroups.error) {
      this.mutations.setGroups(retrievedGroups.res);
    } else if(this.errorState) {
      this.errorState.actions.setError(retrievedGroups.error);
      if(retrievedGroups.errorMsg) {
        this.errorState.actions.setErrorMessage(retrievedGroups.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async retrieveGroupById(groupId: string) {
    const retrievedGroup:ErrorResult<Group> = await retrieveGroup(groupId);
    if(retrievedGroup.res && !retrievedGroup.error) {
      this.mutations.addOrUpdateGroup(retrievedGroup.res);
    } else if(this.errorState) {
      this.errorState.actions.setError(retrievedGroup.error);
      if(retrievedGroup.errorMsg) {
        this.errorState.actions.setErrorMessage(retrievedGroup.errorMsg);
      }
    } else {
      console.error('Missing Error State');
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
