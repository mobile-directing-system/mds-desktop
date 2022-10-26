import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import type { Context } from 'vuex-smart-module';
import type { Error } from '../../../types/Error';

/**
 * function which can be imported in other states to handle errors by adding the error message
 * to the error state, if it exists or a fixed default string if not.
 * @param errorMsg string to add as the error message to the error state
 * @param errorState error state to add the errors to
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function handleErrors(errorMsg?: string, errorState?:Context<Module<ErrorState, ErrorStateGetters, ErrorStateMutations, ErrorStateActions, {}>>) {
  if(errorState) {
    if(errorMsg) {
      errorState.actions.addError(errorMsg);
    } else {
      errorState.actions.addError('There was an error.');
    }
  } else {
    console.error('Missing Error State');
  }
}
/**
 * define the content of the ErrorState
 */
class ErrorState {
  // array with errors
  errors: Error[] = [];
  // map for timeouts associated with errors
  timeouts: Map<string, number> = new Map<string, number>();
}

/**
 * define getters to access the state
 */
class ErrorStateGetters extends Getters<ErrorState> {
  get errors() {
    return () => {
      return this.state.errors;
    };
  }
}

/**
 * define mutations to change the state
 */
class ErrorStateMutations extends Mutations<ErrorState> {
  addError(error:Error){ this.state.errors = [...this.state.errors, error]; }
  removeError(errorId: string) { this.state.errors =  this.state.errors.filter((elem) => elem.errorId !== errorId); }
  addTimeout({errorId, timeoutHandler}:{errorId: string, timeoutHandler: number}) { this.state.timeouts.set(errorId, timeoutHandler);}
  removeTimeout(errorId: string) { this.state.timeouts.delete(errorId); }
}

/**
 * define actions for functions which change the state as a side effect.
 */
class ErrorStateActions extends Actions<ErrorState, ErrorStateGetters, ErrorStateMutations, ErrorStateActions> {
  /**
   * function to add errors to the error state and to add associated timeouts
   * @param errorMessage error message to put in the error
   */
  async addError(errorMessage: string) {
    const errorId = crypto.randomUUID();
    this.mutations.addTimeout({errorId, timeoutHandler: window.setTimeout(() => this.actions.removeError(errorId), 10_000)});
    this.mutations.addError({errorId, errorMessage});
  }
  /**
   * function to remove errors and timeouts from their respective states
   * @param errorId id of the error and associated timeout to remove
   */
  async removeError(errorId: string) {
    this.mutations.removeTimeout(errorId);
    this.mutations.removeError(errorId);
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