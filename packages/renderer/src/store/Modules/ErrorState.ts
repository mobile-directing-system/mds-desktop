import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';

/**
 * define the content of the ErrorState
 */
class ErrorState {
  error = false;
  showError = false;
  errorMessages: string[] = [];
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
  get showError() {
    return () => {
      return this.state.showError;
    };
  }
  get errorMessages() {
    return () => {
      return this.state.errorMessages;
    };
  }
}

/**
 * define mutations to change the state
 */
class ErrorStateMutations extends Mutations<ErrorState> {
  setError(error: boolean) {this.state.error = error;}
  setShowError(showError: boolean) {this.state.showError = showError;}
  setErrorMessages(errorMessages: string[]) {this.state.errorMessages = errorMessages;}
  addErrorMessage(errorMessage: string) {this.state.errorMessages = [...this.state.errorMessages, errorMessage];}
}

/**
 * define actions for functions which change the state as a side effect.
 */
class ErrorStateActions extends Actions<ErrorState, ErrorStateGetters, ErrorStateMutations, ErrorStateActions> {
  async setError(error: boolean) {
    this.commit('setError', error);
    this.commit('setShowError', error);
    setTimeout(() => this.commit('setShowError', false), 10_000);
  }
  async setShowError(showError: boolean) {
    this.commit('setShowError', showError);
  }
  async addErrorMessage(errorMessage: string) {
    this.commit('addErrorMessage', errorMessage);
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