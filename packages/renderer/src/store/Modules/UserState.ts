import type { Store } from 'vuex';
import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import type { Context } from 'vuex-smart-module';
import { createUser, updateUser, deleteUser, retrieveUser, retrieveUsers, updateUserPassword, searchUsers } from '#preload';
import type { User, ErrorResult } from '../../../../types';
import { errorState, handleErrors } from './ErrorState';

function undom(user: User):User {
  return {...user};
}

/**
 * define the content of the UsersState
 */
class UserState {
  users: Map<string, User> = new Map<string, User>();
  page: Map<string, User> = new Map<string, User>();
  searchResult: Map<string, User> = new Map<string, User>();
  total = 0;
}

/**
 * define getters to access the state
 */
class UserStateGetters extends Getters<UserState> {
  get users() {
    return () => {
      return this.state.users;
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
  get total() {
    return () => {
      return this.state.total;
    };
  }
}

/**
 * define mutations to change the state
 */
class UserStateMutations extends Mutations<UserState> {
  setPage(users: User[]) {
    this.state.page.clear();
    users.forEach((elem) => this.state.page.set(elem.id, elem));
  }
  setUsers(users: User[]) {
    this.state.users.clear();
    users.forEach((elem) => this.state.users.set(elem.id, elem));

  }
  setSearchResult(users: User[]) {
    this.state.searchResult.clear();
    users.forEach((elem) => this.state.searchResult.set(elem.id, elem));
  }
  setTotal(total: number) {
    this.state.total = total;
  }
  addOrUpdateUsers(users: User[]) {
    users.forEach((user) => {
        this.state.users.set(user.id, user);
    });
  }
  addOrUpdateUser(user: User){
    this.state.users.set(user.id, user);
  }
  deleteUser(user: User) {
    this.state.users.delete(user.id);
  }
  deleteUserById(userId: string) {
    this.state.users.delete(userId);
  }
}

/**
 * define actions for functions which change the state as a side effect. The
 * funciton here call the user related IPC functions in preload. They handle
 * errors and extract possible results from the ErrorResult containers.
 */
class UserStateActions extends Actions<UserState, UserStateGetters, UserStateMutations, UserStateActions> {

  errorState: Context<typeof errorState> | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }
  async clearUsers() {
    this.mutations.setUsers([]);
    this.mutations.setPage([]);
  }
  async createUser(user: User) {
    const createdUser:ErrorResult<User> = await createUser(undom(user));
    if(createdUser.res && !createdUser.error) {
      this.mutations.addOrUpdateUser(createdUser.res);
    } else {
      handleErrors(createdUser.errorMsg, this.errorState);
    }
  }
  async updateUser(user: User) {
    const userUpdated:ErrorResult<boolean> = await updateUser(undom(user));
    if(userUpdated.res && !userUpdated.error) {
      this.actions.retrieveUserById(user.id);
    } else {
      handleErrors(userUpdated.errorMsg, this.errorState);
    }
  }
  async updateUserPasswordById({userId, pass}:{userId: string, pass: string}) {
    const userPasswordUpdated:ErrorResult<boolean> = await updateUserPassword(userId, pass);
    if(!userPasswordUpdated.res && userPasswordUpdated.error) {
      handleErrors(userPasswordUpdated.errorMsg, this.errorState);
    }
  }
  async deleteUserById(userId: string) {
    const userDeleted: ErrorResult<boolean> = await deleteUser(userId);
    if(userDeleted.res && !userDeleted.error) {
      this.mutations.deleteUserById(userId);
    }  else {
      handleErrors(userDeleted.errorMsg, this.errorState);
    }
  }
  async retrieveUsers({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedUsers: ErrorResult<User[]> = await retrieveUsers(amount, offset, orderBy, orderDir);
    if(retrievedUsers.res && retrievedUsers.total !== undefined && !retrievedUsers.error) {
      this.mutations.setPage(retrievedUsers.res);
      this.mutations.addOrUpdateUsers(retrievedUsers.res);
      this.mutations.setTotal(retrievedUsers.total);
    } else {
      handleErrors(retrievedUsers.errorMsg, this.errorState);
    }
  }
  async retrieveUserById(userId: string) {
    const retrievedUser: ErrorResult<User> = await retrieveUser(userId);
    if(retrievedUser.res && !retrievedUser.error) {
      this.mutations.addOrUpdateUser(retrievedUser.res);
    } else {
      handleErrors(retrievedUser.errorMsg, this.errorState);
    }
  }
  async searchUsersByQuery({query, limit, offset}:{query: string, limit?: number, offset?: number|undefined}) {
    const searchResult: ErrorResult<User[]> = await searchUsers(query, limit, offset);
    if(searchResult.res && !searchResult.error) {
      this.mutations.setSearchResult(searchResult.res);
      this.mutations.addOrUpdateUsers(searchResult.res);
    } else {
      handleErrors(searchResult.errorMsg, this.errorState);
    }
  }
}

/**
 * generate a Module based on the state, getters, mutations and actions
 */
export const userState = new Module({
  state: UserState,
  getters: UserStateGetters,
  mutations: UserStateMutations,
  actions: UserStateActions,
});

/**
 * export a composable function to be able to use this module in .vue files
 */
export const useUserState = createComposable(userState);