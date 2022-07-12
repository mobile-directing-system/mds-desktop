import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import {createOperation, updateOperation, retrieveOperation, retrieveOperations } from '#preload';
import type { Operation, ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState } from './ErrorState';

function undom(operation: Operation):Operation {
    return {
        ...operation,
    };
}

/**
 * define the content of the OperationsState
 */
class OperationsState {
  operations: Operation[] = [];
}

/**
 * define getters to access the state
 */
class OperationsStateGetters extends Getters<OperationsState> {
  get operations() {
    return () => {
      return this.state.operations;
    };
  }
}

/**
 * define mutations to change the state
 */
class OperationsStateMutations extends Mutations<OperationsState> {
  setOperations(operations: Operation[]) {
    this.state.operations = operations;
  }
  addOperation(operation: Operation) {
    this.state.operations = [...this.state.operations, operation];
  }
  addOrUpdateOperation(operation: Operation){
    if (this.state.operations.filter((elem) => elem.id === operation.id).length > 0) {
      this.state.operations = this.state.operations.map((elem) => (elem.id === operation.id)? operation : elem);
    } else {
        this.state.operations = [...this.state.operations, operation];
    }
  }
  updateOperation(operation: Operation) {
    this.state.operations = this.state.operations.map((elem) => (elem.id === operation.id)? operation : elem);
  }
  deleteOperation(operation: Operation) {
      this.state.operations = this.state.operations.filter((elem) => elem.id !== operation.id);
  }
  deleteOperationById(operationId: string) {
    this.state.operations = this.state.operations.filter((elem) => elem.id !== operationId);
  }
}

/**
 * define actions for functions which change the state as a side effect..
 */
class OperationsStateActions extends Actions<OperationsState, OperationsStateGetters, OperationsStateMutations, OperationsStateActions> {

  errorState: Context<typeof errorState> | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }

  async createOperation(operation: Operation) {
    const createdOperation: ErrorResult<Operation> = await createOperation(undom(operation));
    if(createdOperation.res && !createdOperation.error) {
      this.mutations.addOperation(createdOperation.res);
    } else if(this.errorState) {
      this.errorState.actions.setError(createdOperation.error);
      if(createdOperation.errorMsg) {
        this.errorState.actions.setErrorMessage(createdOperation.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }

  async updateOperation(operation: Operation) {
    const operationUpdated: ErrorResult<boolean> = await updateOperation(undom(operation));
    if(operationUpdated.res && !operationUpdated.error) {
        this.actions.retrieveOperation(operation.id);
    } else if(this.errorState) {
      this.errorState.actions.setError(operationUpdated.error);
      if(operationUpdated.errorMsg) {
        this.errorState.actions.setErrorMessage(operationUpdated.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }

  async retrieveOperation(operationId: string) {
    const retrievedOperation: ErrorResult<Operation> = await retrieveOperation(operationId);
    if(retrievedOperation.res && !retrievedOperation.error) {
      this.mutations.addOrUpdateOperation(retrievedOperation.res);
    } else if(this.errorState) {
      this.errorState.actions.setError(retrievedOperation.error);
      if(retrievedOperation.errorMsg) {
        this.errorState.actions.setErrorMessage(retrievedOperation.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }

  async retrieveOperations({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedOperations: ErrorResult<Operation[]> = await retrieveOperations(amount, offset, orderBy, orderDir);
    if(retrievedOperations.res && !retrievedOperations.error) {
      this.mutations.setOperations(retrievedOperations.res);
    } else if(this.errorState) {
      this.errorState.actions.setError(retrievedOperations.error);
      if(retrievedOperations.errorMsg) {
        this.errorState.actions.setErrorMessage(retrievedOperations.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
}

/**
 * generate a Module based on the state, getters, mutations and actions
 */
export const operationsState = new Module({
  state: OperationsState,
  getters: OperationsStateGetters,
  mutations: OperationsStateMutations,
  actions: OperationsStateActions,
});

/**
 * export a composable function to be able to use this module in .vue files
 */
export const useOperationsState = createComposable(operationsState);