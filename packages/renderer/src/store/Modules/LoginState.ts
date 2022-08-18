import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { login, logout } from '#preload';
import type { ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';

/**
 * define the content of the LoginInfoState
 */
class LoginState {
  loggedIn = false;
  loggingIn = false;
  loggedInUser = '';
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
}

/**
 * define mutations to change the state
 */
class LoginStateMutations extends Mutations<LoginState> {
  setLoggedIn(loggedIn: boolean) {this.state.loggedIn = loggedIn;}
  setLoggingIn(loggingIn: boolean) {this.state.loggingIn = loggingIn;}
  setLoggedInUser(loggedInUser: string) {this.state.loggedInUser = loggedInUser;}
}

/**
 * define actions for functions which change the state as a side effect.
 * setLoggingIn function only changes the loggingIn state to the passed
 * boolean. login function calls the login glue code of the preload script.
 */
class LoginStateActions extends Actions<LoginState, LoginStateGetters, LoginStateMutations, LoginStateActions> {

  errorState: Context<typeof errorState> | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }

  async login({username, password}:{username:string, password:string}) {
    await this.actions.setLoggingIn(true);
    const loggedIn:ErrorResult<boolean> = await login(username, password);
    await this.actions.setLoggingIn(false);
    if(loggedIn.res && !loggedIn.error) {
      this.mutations.setLoggedIn(loggedIn.res);
      this.mutations.setLoggedInUser(username);
    }  else {
      handleErrors(loggedIn.errorMsg, this.errorState);
    }
  }
  async setLoggingIn(loggingIn: boolean) {
    this.mutations.setLoggingIn(loggingIn);
  }
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
