import type { Store } from 'vuex';
import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import type {Context} from 'vuex-smart-module';
import { retrievePermissions, updatePermissions } from '#preload';
import type { Permission, ErrorResult } from '../../../../types';
import { errorState, handleErrors } from './ErrorState';

/**
 * function to create a deep enough copy of a permissions object to be able to pass through the IPC
 * @param permissions permissions object to be undomed
 * @returns a relatively deep copy of the permissions object
 */
function undom(permissions: Permission[]):Permission[] {
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
  permissions: Map<string, Permission[]> = new Map();
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
  /**
   * Mutation to set the permissions of a user
   * @param param0 {userId, permission} set the permissions state of the user with userID to permissions
   */
  setPermissions({userId, permissions}:{userId: string, permissions: Permission[]}) {this.state.permissions.set(userId, permissions);}
  /**
   * Mutation to add permissions to the permissions of a user
   * @param param0 {userId, permission} add permission to the permissions state of the user with userId
   */
  addPermissions({userId, permissions}:{userId: string, permissions: Permission[]}) {
    const existingPermissions = this.state.permissions.get(userId);
    if(existingPermissions) {
      this.state.permissions.set(userId, existingPermissions.concat(permissions));
    } else {
      this.state.permissions.set(userId, permissions);
    }
  }
  /**
   * Mutation to remove the permission of a user from the permissions state
   * @param userId id of the user whose permissions should be removed
   */
  removePermissions(userId: string) {this.state.permissions.delete(userId);}
  /**
   * Mutation to completely clear the permissions state
   */
  clearPermissions() {this.state.permissions.clear();}
}

/**
 * define actions for functions which change the state as a side effect.
 */
class PermissionsStateActions extends Actions<PermissionsState, PermissionsStateGetters, PermissionsStateMutations, PermissionsStateActions> {

  //reference to the error state to be able to add errors
  errorState: Context<typeof errorState> | undefined;

  // set error state on init of the store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }

  /**
   * Action to retrieve the permission for a user and set them in the permissions state
   * @param userId id of the user for which to retrieve permissions
   */
  async retrievePermissions(userId: string) {
    const permissions: ErrorResult<Permission[]> = await retrievePermissions(userId);
    if(permissions.res && !permissions.error) {
      this.mutations.setPermissions({userId, permissions: permissions.res});
    }  else {
      handleErrors(permissions.errorMsg, this.errorState);
    }
  }

  /**
   * Action to addPermission to a users permission and then retrieve them again to be up to date.
   * @param param0 {userId, permissions} for the user with userId permissions are concatenated to its permissions state
   */
  async addPermissions({userId, permissions}:{userId: string, permissions: Permission[]}) {
    const existingPermissions = this.state.permissions.get(userId);
    const permissionsSet: ErrorResult<boolean> = await updatePermissions(userId, (existingPermissions)? undom(existingPermissions.concat(permissions)):permissions);
    if(permissionsSet.res && !permissionsSet.error) {
      this.actions.retrievePermissions(userId);
    }  else {
      handleErrors(permissionsSet.errorMsg, this.errorState);
    }
  }

  /**
   * Action to updateAllPermission of a user, e.g. replace them. Then retrieve them again to be up to date.
   * @param param0 {userId, permissions} for the user with userId its permissions are replaced with permissions argument
   */
  async updateAllPermissions({userId, permissions}:{userId: string, permissions: Permission[]}) {
    const permissionsSet: ErrorResult<boolean> = await updatePermissions(userId, permissions);
    if(permissionsSet.res && !permissionsSet.error) {
      this.actions.retrievePermissions(userId);
    }  else {
      handleErrors(permissionsSet.errorMsg, this.errorState);
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