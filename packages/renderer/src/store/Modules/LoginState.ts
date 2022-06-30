import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { login, logout } from '#preload';

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
  get getLoggedIn() {
    return () => {
      return this.state.loggedIn;
    };
  }
  get getLoggingIn() {
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
  async login({username, password}:{username:string, password:string}) {
    const loggedIn = await login(username, password);
    this.commit('setLoggedIn', loggedIn);
    this.commit('setLoggedInUser', username);
  }
  async setLoggingIn(loggingIn: boolean) {
    this.commit('setLoggingIn', loggingIn);
  }
  async logout() {
    const loggedOut = await logout();
    if(loggedOut) {
      this.commit('setLoggedIn', loggedOut);
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
