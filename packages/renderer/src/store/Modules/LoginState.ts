import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { login, logout } from '#preload';
import type { ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState } from './ErrorState';

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
    const loggedIn:ErrorResult<boolean> = await login(username, password);
    if(loggedIn.res && !loggedIn.error) {
      this.commit('setLoggedIn', loggedIn.res);
      this.commit('setLoggedInUser', username);
    } else if(this.errorState) {
      this.errorState.dispatch('setError', loggedIn.error);
      if(loggedIn.errorMsg) {
        this.errorState.dispatch('setErrorMessage', loggedIn.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async setLoggingIn(loggingIn: boolean) {
    this.commit('setLoggingIn', loggingIn);
  }
  async logout() {
    const loggedOut:ErrorResult<boolean> = await logout();
    if(loggedOut.res && !loggedOut.error) {
      this.commit('setLoggedIn', false);
    } else if(this.errorState) {
      this.errorState.dispatch('setError', loggedOut.error);
      if(loggedOut.errorMsg) {
        this.errorState.dispatch('setErrorMessage', loggedOut.errorMsg);
      }
    } else {
      console.error('Missing Error State');
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
