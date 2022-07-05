import type { Store } from 'vuex';
import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import type {Context} from 'vuex-smart-module';
import { retrievePermissions, updatePermissions } from '#preload';
import type { Permissions, Permission, ErrorResult } from '../../../../types';
import { errorState } from './ErrorState';


function undom(permissions: Permissions):Permissions {
  return permissions.map((elem:Permission) => {
    return {
      name: elem.name,
      options: (elem.options)? {...elem.options}: elem.options,
    };});
}

/**
 * define the content of the LoginInfoState
 */
class PermissionsState {
  permissions: Map<string, Permissions> = new Map();
}

/**
 * define getters to access the state
 */
class PermissionsStateGetters extends Getters<PermissionsState> {
  get getPermissions() {
    return () => {
      return this.state.permissions;
    };
  }
}

/**
 * define mutations to change the state
 */
class PermissionsStateMutations extends Mutations<PermissionsState> {
  setPermissions({userId, permissions}:{userId: string, permissions: Permissions}) {this.state.permissions.set(userId, permissions);}
  addPermissions({userId, permissions}:{userId: string, permissions: Permissions}) {
    const existingPermissions = this.state.permissions.get(userId);
    if(existingPermissions) {
      this.state.permissions.set(userId, existingPermissions.concat(permissions));
    } else {
      this.state.permissions.set(userId, permissions);
    }
  }
  removePermissions(userId: string) {this.state.permissions.delete(userId);}
  clearPermissions() {this.state.permissions.clear();}
}

/**
 * define actions for functions which change the state as a side effect.
 * setLoggingIn function only changes the loggingIn state to the passed
 * boolean. login function calls the login glue code of the preload script.
 */
class PermissionsStateActions extends Actions<PermissionsState, PermissionsStateGetters, PermissionsStateMutations, PermissionsStateActions> {

  errorState: Context<typeof errorState> | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }

  async retrievePermissions(userId: string) {
    const permissions: ErrorResult<Permissions> = await retrievePermissions(userId);
    if(permissions.res && !permissions.error) {
      this.commit('setPermissions', {userId, permissions: permissions.res});
    } else if(this.errorState) {
      this.errorState.dispatch('setError', permissions.error);
      if(permissions.errorMsg) {
        this.errorState.dispatch('setErrorMessage', permissions.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async addPermissions({userId, permissions}:{userId: string, permissions: Permissions}) {
    const existingPermissions = this.state.permissions.get(userId);
    const permissionsSet: ErrorResult<boolean> = await updatePermissions(userId, (existingPermissions)? undom(existingPermissions.concat(permissions)):permissions);
    if(permissionsSet.res && !permissionsSet.error) {
      this.commit('addPermissions', {userId, permissions});
    } else if(this.errorState) {
      this.errorState.dispatch('setError', permissionsSet.error);
      if(permissionsSet.errorMsg) {
        this.errorState.dispatch('setErrorMessage', permissionsSet.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async updateAllPermissions({userId, permissions}:{userId: string, permissions: Permissions}) {
    const permissionsSet: ErrorResult<boolean> = await updatePermissions(userId, permissions);
    if(permissionsSet.res && !permissionsSet.error) {
      this.commit('setPermissions', {userId, permissions});
    } else if(this.errorState) {
      this.errorState.dispatch('setError', permissionsSet.error);
      if(permissionsSet.errorMsg) {
        this.errorState.dispatch('setErrorMessage', permissionsSet.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
}

/**
 * generate a Module based on the state, getters, mutations and actions
 */
export const permissionsState = new Module({
  state: PermissionsState,
  getters: PermissionsStateGetters,
  mutations: PermissionsStateMutations,
  actions: PermissionsStateActions,
});

/**
 * export a composable function to be able to use this module in .vue files
 */
export const usePermissionsState = createComposable(permissionsState);