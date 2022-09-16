import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import {createOperation, updateOperation, retrieveOperation, retrieveOperations, searchOperations, retrieveOperationMembers, updateOperationMembers } from '#preload';
import type { User, Operation, ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';
import { root, modulesStore } from '../index';
import type { userState } from './UserState';

/**
 * function to create a deep enough copy of a operation object to be able to pass through the IPC
 * @param operation operation object to be undomed
 * @returns a relatively deep copy of the operation object
 */
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
  /**
   * Mutation to set the operations state to operations (previous operations are cleared)
   * @param operations operations the operations state is being set to
   */
  setOperations(operations: Operation[]) {
    this.state.operations.clear();
    operations.forEach((elem) => this.state.operations.set(elem.id, elem));
  }
  /**
   * Mutation to set the page state to the page (previous pages are cleared)
   * @param page opertions the page state is being set to
   */
  setPage(page: Operation[]) {
    this.state.page.clear();
    page.forEach((elem) => this.state.page.set(elem.id, elem));
  }
  /**
   * Mutation to set the search result (previous search result is cleared)
   * @param operations operations the search result is being set to
   */
  setSearchResult(operations: Operation[]) {
    this.state.searchResult.clear();
    operations.forEach((elem) => this.state.searchResult.set(elem.id, elem));
  }
  /**
   * Mutation to set the operation memebers (previous operation members are overriden)
   * @param param0 {operationId, memberIds} set the members of the operation with operationId to memberIds
   */
  setOperationMembers({operationId, memberIds}:{operationId: string, memberIds: string[]}) {
      this.state.members.set(operationId, memberIds);
  }
  /**
   * Mutation to set the total available operations
   * @param total number to set the total state to
   */
  setTotal(total: number) {
    this.state.total = total;
  }
  /**
   * Mutation to add or update operations, if they exist, to the operations state
   * @param operations opertions to be added or updated in the operations state
   */
  addOrUpdateOperations(operations: Operation[]) {
    operations.forEach((elem) => this.state.operations.set(elem.id, elem));
  }
  /**
   * Mutation to add or update a single operation, if it exists, to the operations state
   * @param operation operation to be added or updated in the operations state
   */
  addOrUpdateOperation(operation: Operation){
    this.state.operations.set(operation.id, operation);
  }
  /**
   * Mutation to delete a single operation from the operations state
   * @param operation the opertion to be deleted form the operations state
   */
  deleteOperation(operation: Operation) {
      this.state.operations.delete(operation.id);
  }
  /**
   * Mutation to delete a single operation from the operations state by id
   * @param operationId id of the operation to be deleted from the operations state
   */
  deleteOperationById(operationId: string) {
    this.state.operations.delete(operationId);
  }
}

/**
 * define actions for functions which change the state as a side effect..
 */
class OperationsStateActions extends Actions<OperationsState, OperationsStateGetters, OperationsStateMutations, OperationsStateActions> {

  //reference to the error state to be able to add errors
  errorState: Context<typeof errorState> | undefined;
  // root context to be able to get user context
  ctx: Context<typeof root> | undefined;
  // user context to be able to use user store actions
  userCtx: Context<typeof userState> | undefined; //maybe use a function exported from the vuex-module similar to the handle error function

  // set error state on init of the store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }

  /**
   * Action to clear the operations
   */
  async clearOperations() {
    this.mutations.setOperations([]);
  }

  /**
   * Action to create an operation in the backend and add it to the operations state
   * @param param0 {operation, memberIds} operation to create and memberIds to add
   */
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

  /**
   * Action to update an operation in the backend and retrieve it again to be up to date.
   * @param operation operation to be updated
   */
  async updateOperation(operation: Operation) {
    const operationUpdated: ErrorResult<boolean> = await updateOperation(undom(operation));
    if(operationUpdated.res && !operationUpdated.error) {
        this.actions.retrieveOperation(operation.id);
    }  else {
      handleErrors(operationUpdated.errorMsg, this.errorState);
    }
  }

  /**
   * Action to retrieve a single operation by id from the backend and add it to the operation state
   * @param operationId id of the operation to be retrieved
   */
  async retrieveOperation(operationId: string) {
    const retrievedOperation: ErrorResult<Operation> = await retrieveOperation(operationId);
    if(retrievedOperation.res && !retrievedOperation.error) {
      this.mutations.addOrUpdateOperation(retrievedOperation.res);
    }  else {
      handleErrors(retrievedOperation.errorMsg, this.errorState);
    }
  }

  /**
   * Action to retrieve a number of operations from the backend and add them to the operations state, page state and total state
   * @param param0 {amount, offset, orderBy, orderDir} amount is the number of operations to be retrieved,
   *                                                   offset is where the retrieval starts, orderBy is
   *                                                   which operation property is used for sorting and orderDir
   *                                                   is the direction for sorting
   */
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

  /**
   * Action to search for operations in the backend and add them to the search result state and operations state
   * @param param0 {query, limit, offset} query is the search string, limit is the maximum amount
   *                                      of search results and offset if where to start the search
   */
  async searchOperationsByQuery({query, limit, offset}:{query: string, limit?: number, offset?: number|undefined}) {
    const searchResult: ErrorResult<Operation[]> = await searchOperations(query, limit, offset);
    if(searchResult.res && !searchResult.error) {
      this.mutations.setSearchResult(searchResult.res);
      this.mutations.addOrUpdateOperations(searchResult.res);
    } else {
      handleErrors(searchResult.errorMsg, this.errorState);
    }
  }

  /**
   * Action to retrieve the members of an operation by its id from the backend and add them to the members state and users store
   * @param operationId the id of the opertion for which to retrieve the members
   */
  async retrieveOperationMembersById(operationId: string) {
    const retrievedOperationMembers: ErrorResult<User[]> = await retrieveOperationMembers(operationId);
    if(retrievedOperationMembers.res && !retrievedOperationMembers.error) {
      // Add members to the members state
      this.mutations.setOperationMembers({operationId, memberIds: retrievedOperationMembers.res.map((elem) => elem.id)});
      if(!this.userCtx && !this.ctx){
        // Add members to the users store
        this.ctx = root.context(modulesStore);
        this.userCtx = this.ctx.modules.userState;
      }
      if(this.userCtx) {
        this.userCtx.commit('deepAddOrUpdateUsers', retrievedOperationMembers.res);
      }
    } else {
      handleErrors(retrievedOperationMembers.errorMsg, this.errorState);
    }
  }

  /**
   * Action to update the members of an opertion by its id in the backend and retrieve them again to be up to date.
   * @param param0 {operationId, memberIds} update the members of the operation with operationId with the memberIds
   */
  async updateOperationMembersById({operationId, memberIds}:{operationId: string, memberIds: string[]}) {
    const operationMembersUpdated: ErrorResult<boolean> = await updateOperationMembers(operationId, [...memberIds]);
    if(operationMembersUpdated.res && !operationMembersUpdated.error) {
      await this.actions.retrieveOperationMembersById(operationId);
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