import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { login, logout } from '#preload';
import type { ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';
import { root, modulesStore } from '../index';
import type { permissionsState } from './PermissionsState';
import type { userState } from './UserState';

/**
 * define the content of the LoginInfoState
 */
class LoginState {
  // boolean indicating if a user is logged in
  loggedIn = false;
  // boolean indicating if a user is currently logging in
  loggingIn = false;
  // string with the username of the user logged in
  loggedInUser = '';
  // id of the user logged in
  loggedInUserId = '';
}

/**
 * define getters to access the state
 */
class LoginStateGetters extends Getters<LoginState> {
  get loggedIn() {
    return () => {
      return this.state.loggedIn;
    };
  }
  get loggingIn() {
    return () => {
      return this.state.loggingIn;
    };
  }
  get loggedInUser() {
    return () => {
      return this.state.loggedInUser;
    };
  }
  get loggedInUserId() {
    return () => {
      return this.state.loggedInUserId;
    };
  }
}

/**
 * define mutations to change the state
 */
class LoginStateMutations extends Mutations<LoginState> {
  /**
   * Set the loggedin state
   * @param loggedIn boolean to set the loggedIn state to
   */
  setLoggedIn(loggedIn: boolean) {this.state.loggedIn = loggedIn;}
  /**
   * Set the loggingin state
   * @param loggingIn boolean to set the loggingIn state to
   */
  setLoggingIn(loggingIn: boolean) {this.state.loggingIn = loggingIn;}
  /**
   * Set the loggedInUser state
   * @param loggedInUser boolean to set the loggedInUser state to
   */
  setLoggedInUser(loggedInUser: string) {this.state.loggedInUser = loggedInUser;}
  /**
   * Set the loggedInUserId state
   * @param loggedInUserId id of the user logging in
   */
  setLoggedInUserId(loggedInUserId: string) {this.state.loggedInUserId = loggedInUserId;}
}

/**
 * define actions for functions which change the state as a side effect.
 * setLoggingIn function only changes the loggingIn state to the passed
 * boolean. login function calls the login glue code of the preload script.
 */
class LoginStateActions extends Actions<LoginState, LoginStateGetters, LoginStateMutations, LoginStateActions> {

  errorState: Context<typeof errorState> | undefined;

  // root context to be able to get permission context
  ctx: Context<typeof root> | undefined;
  // user context to be able to use permission store actions
  permissionsCtx: Context<typeof permissionsState> | undefined; //maybe use a function exported from the vuex-module similar to the handle error function
  userCtx: Context<typeof userState> | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }

  /**
   * Action to perform the login in the backend and set all necessary dependencies in the login state
   * @param param0 {username, password} username and password to login with
   */
  async login({username, password}:{username:string, password:string}) {
    // set logging in state to true to show login spinner
    await this.actions.setLoggingIn(true);
    const loggedIn:ErrorResult<string> = await login(username, password);
    // set logging in state to false to hide login spinner
    await this.actions.setLoggingIn(false);
    if(loggedIn.res && !loggedIn.error) {
      if(!this.permissionsCtx && !this.ctx){
        // Add members to the users store
        this.ctx = root.context(modulesStore);
      }
      // get permission store context
      if(!this.permissionsCtx && this.ctx) {
        this.permissionsCtx = this.ctx.modules.permissionsState;
      }
      // get user store context
      if(!this.userCtx && this.ctx) {
        this.userCtx = this.ctx.modules.userState;
      }
      this.mutations.setLoggedIn(true);
      this.mutations.setLoggedInUser(username);
      this.mutations.setLoggedInUserId(loggedIn.res);
      // retrieve user object for user which is logged in
      this.userCtx?.actions.retrieveUserById(loggedIn.res);
      // retrieve permissions for the user which is logged in
      this.permissionsCtx?.actions.retrievePermissions(loggedIn.res);
    }  else {
      handleErrors(loggedIn.errorMsg, this.errorState);
    }
  }
  /**
   * Action to set the loggingIn state
   * @param loggingIn boolean to set the loggingIn state to
   */
  async setLoggingIn(loggingIn: boolean) {
    this.mutations.setLoggingIn(loggingIn);
  }
  /**
   * Action to perform the logout in the backend and reset all necessary dependencies
   */
  async logout() {
    const loggedOut:ErrorResult<boolean> = await logout();
    if(loggedOut.res && !loggedOut.error) {
      this.mutations.setLoggedIn(false);
    }  else {
      handleErrors(loggedOut.errorMsg, this.errorState);
    }
  }
}

/**
 * generate a Module based on the state, getters, mutations and actions
 */
export const loginState = new Module({
  state: LoginState,
  getters: LoginStateGetters,
  mutations: LoginStateMutations,
  actions: LoginStateActions,
});

/**
 * export a composable function to be able to use this module in .vue files
 */
export const useLoginState = createComposable(loginState);
