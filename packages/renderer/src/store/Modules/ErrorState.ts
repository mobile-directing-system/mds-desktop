import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';

/**
 * define the content of the ErrorState
 */
class ErrorState {
  error = false;
  errorMessage = '';
}

/**
 * define getters to access the state
 */
class ErrorStateGetters extends Getters<ErrorState> {
  get error() {
    return () => {
      return this.state.error;
    };
  }
  get errorMessage() {
    return () => {
      return this.state.errorMessage;
    };
  }
}

/**
 * define mutations to change the state
 */
class ErrorStateMutations extends Mutations<ErrorState> {
  setError(error: boolean) {this.state.error = error;}
  setErrorMessage(errorMessages: string) {this.state.errorMessage = errorMessages;}
}

/**
 * define actions for functions which change the state as a side effect.
 */
class ErrorStateActions extends Actions<ErrorState, ErrorStateGetters, ErrorStateMutations, ErrorStateActions> {
  async setError(error: boolean) {
    this.commit('setError', error);
    setTimeout(() => this.commit('setError', false), 10_000);
  }
  async setErrorMessage(errorMessage: string) {
    this.commit('setErrorMessage', errorMessage);
    setTimeout(() => this.commit('setErrorMessage', ''), 10_000);
  }
}

/**
 * generate a Module based on the state, getters, mutations and actions
 */
export const errorState = new Module({
  state: ErrorState,
  getters: ErrorStateGetters,
  mutations: ErrorStateMutations,
  actions: ErrorStateActions,
});

/**
 * export a composable function to be able to use this module in .vue files
 */
export const useErrorState = createComposable(errorState);