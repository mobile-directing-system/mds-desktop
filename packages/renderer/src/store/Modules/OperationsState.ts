import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import {createOperation, updateOperation, retrieveOperation, retrieveOperations, searchOperations, retrieveOperationMembers, updateOperationMembers } from '#preload';
import type { User, Operation, ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';
import { root, modulesStore } from '../index';
import type { userState } from './UserState';

function undom(operation: Operation):Operation {
    return {
        ...operation,
    };
}
/**
 * define the content of the OperationsState
 */
class OperationsState {
  operations: Map<string, Operation> = new Map<string, Operation>();
  page: Map<string, Operation> = new Map<string, Operation>();
  searchResult: Map<string, Operation> = new Map<string, Operation>();
  members: Map<string, string[]> = new Map<string, string[]>();
  total = 0;
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
  get page() {
    return () => {
      return this.state.page;
    };
  }
  get searchResults() {
    return () => {
      return this.state.searchResult;
    };
  }
  get members() {
    return () => {
      return this.state.members;
    };
  }
  get total() {
    return () => {
      return this.state.total;
    };
  }
}

/**
 * define mutations to change the state
 */
class OperationsStateMutations extends Mutations<OperationsState> {
  setOperations(operations: Operation[]) {
    this.state.operations.clear();
    operations.forEach((elem) => this.state.operations.set(elem.id, elem));
  }
  setPage(page: Operation[]) {
    this.state.operations.clear();
    page.forEach((elem) => this.state.page.set(elem.id, elem));
  }
  setSearchResult(operations: Operation[]) {
    this.state.searchResult.clear();
    operations.forEach((elem) => this.state.searchResult.set(elem.id, elem));
  }
  setOperationMembers({operationId, memberIds}:{operationId: string, memberIds: string[]}) {
      this.state.members.set(operationId, memberIds);
  }
  setTotal(total: number) {
    this.state.total = total;
  }
  addOrUpdateOperations(operations: Operation[]) {
    operations.forEach((elem) => this.state.operations.set(elem.id, elem));
  }
  addOrUpdateOperation(operation: Operation){
    this.state.operations.set(operation.id, operation);
  }
  deleteOperation(operation: Operation) {
      this.state.operations.delete(operation.id);
  }
  deleteOperationById(operationId: string) {
    this.state.operations.delete(operationId);
  }
}

/**
 * define actions for functions which change the state as a side effect..
 */
class OperationsStateActions extends Actions<OperationsState, OperationsStateGetters, OperationsStateMutations, OperationsStateActions> {

  errorState: Context<typeof errorState> | undefined;  
  ctx: Context<typeof root> | undefined;
  userCtx: Context<typeof userState> | undefined; //maybe use a function exported from the vuex-module similar to the handle error function


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }

  async clearOperations() {
    this.mutations.setOperations([]);
  }

  async createOperation({operation, memberIds}:{operation: Operation, memberIds: string[]}) {
    const createdOperation: ErrorResult<Operation> = await createOperation(undom(operation));
    if(createdOperation.res && !createdOperation.error) {
      this.mutations.addOrUpdateOperation(createdOperation.res);
      if(memberIds.length > 0) {
        this.actions.updateOperationMembersById({operationId: createdOperation.res.id, memberIds});
      }
    }  else {
      handleErrors(createdOperation.errorMsg, this.errorState);
    }
  }

  async updateOperation(operation: Operation) {
    const operationUpdated: ErrorResult<boolean> = await updateOperation(undom(operation));
    if(operationUpdated.res && !operationUpdated.error) {
        this.actions.retrieveOperation(operation.id);
    }  else {
      handleErrors(operationUpdated.errorMsg, this.errorState);
    }
  }

  async retrieveOperation(operationId: string) {
    const retrievedOperation: ErrorResult<Operation> = await retrieveOperation(operationId);
    if(retrievedOperation.res && !retrievedOperation.error) {
      this.mutations.addOrUpdateOperation(retrievedOperation.res);
    }  else {
      handleErrors(retrievedOperation.errorMsg, this.errorState);
    }
  }

  async retrieveOperations({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedOperations: ErrorResult<Operation[]> = await retrieveOperations(amount, offset, orderBy, orderDir);
    if(retrievedOperations.res && retrievedOperations.total !== undefined && !retrievedOperations.error) {
      this.mutations.setPage(retrievedOperations.res);
      this.mutations.addOrUpdateOperations(retrievedOperations.res);
      this.mutations.setTotal(retrievedOperations.total);
    }  else {
      handleErrors(retrievedOperations.errorMsg, this.errorState);
    }
  }

  async searchOperationsByQuery({query, limit, offset}:{query: string, limit?: number, offset?: number|undefined}) {
    const searchResult: ErrorResult<Operation[]> = await searchOperations(query, limit, offset);
    if(searchResult.res && !searchResult.error) {
      this.mutations.setSearchResult(searchResult.res);
      this.mutations.addOrUpdateOperations(searchResult.res);
    } else {
      handleErrors(searchResult.errorMsg, this.errorState);
    }
  }

  async retrieveOperationMembersById({operationId, amount, offset, orderBy, orderDir}:{operationId: string, amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedOperationMembers: ErrorResult<User[]> = await retrieveOperationMembers(operationId, amount, offset, orderBy, orderDir);
    if(retrievedOperationMembers.res && !retrievedOperationMembers.error) {
      this.mutations.setOperationMembers({operationId, memberIds: retrievedOperationMembers.res.map((elem) => elem.id)});
      if(!this.userCtx && !this.ctx){
        this.ctx = root.context(modulesStore);
        this.userCtx = this.ctx.modules.userState;
      }
      if(this.userCtx) {
        this.userCtx.commit('addOrUpdateUsers', retrievedOperationMembers.res);
      }
    } else {
      handleErrors(retrievedOperationMembers.errorMsg, this.errorState);
    }
  }

  async updateOperationMembersById({operationId, memberIds}:{operationId: string, memberIds: string[]}) {
    const operationMembersUpdated: ErrorResult<boolean> = await updateOperationMembers(operationId, [...memberIds]);
    if(operationMembersUpdated.res && !operationMembersUpdated.error) {
      await this.actions.retrieveOperationMembersById({operationId, amount: memberIds.length, offset: 0});
    } else {
      handleErrors(operationMembersUpdated.errorMsg, this.errorState);
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