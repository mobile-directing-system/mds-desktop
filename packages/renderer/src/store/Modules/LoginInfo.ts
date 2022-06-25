import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { login } from '#preload';

/**
 * define the content of the LoginInfoState
 */
class LoginInfoState {
  loggedIn = false;
  loggingIn = false;
}

/**
 * define getters to access the state
 */
class LoginInfoGetter extends Getters<LoginInfoState> {
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
}

/**
 * define mutations to change the state
 */
class LoginInfoMutations extends Mutations<LoginInfoState> {
  setLoggedIn(loggedIn: boolean) {this.state.loggedIn = loggedIn;}
  setLoggingIn(loggingIn: boolean) {this.state.loggingIn = loggingIn;}
}

/**
 * define actions for functions which change the state as a side effect.
 * setLoggingIn function only changes the loggingIn state to the passed
 * boolean. login function calls the login glue code of the preload script.
 */
class LoginInfoActions extends Actions<LoginInfoState, LoginInfoGetter, LoginInfoMutations, LoginInfoActions> {
  async login({username, password}:{username:string, password:string}) {
    const loggedIn = await login(username, password);
    this.commit('setLoggedIn', loggedIn);
  }
  async setLoggingIn(loggingIn: boolean) {
    this.commit('setLoggingIn', loggingIn);
  }
}

/**
 * generate a Module based on the state, getters, mutations and actions
 */
export const loginInfo = new Module({
  state: LoginInfoState,
  getters: LoginInfoGetter,
  mutations: LoginInfoMutations,
  actions: LoginInfoActions,
});

/**
 * export a composable function to be able to use this module in .vue files
 */
export const useLoginInfo = createComposable(loginInfo);
