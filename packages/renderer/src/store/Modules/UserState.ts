import type { Store } from 'vuex';
import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import type { Context } from 'vuex-smart-module';
import { createUser, updateUser, deleteUser, retrieveUser, retrieveUsers, updateUserPassword, searchUsers } from '#preload';
import type { User, ErrorResult } from '../../../../types';
import { errorState, handleErrors } from './ErrorState';

/**
 * function to create a deep enough copy of a user object to be able to pass through the IPC
 * @param user user object to be undomed
 * @returns a relatively deep copy of the user object
 */
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
  /**
   * Mutation to set the page to the passed user array (clear the previous page)
   * @param users users the page state is being set to
   */
  setPage(users: User[]) {
    this.state.page.clear();
    users.forEach((elem) => this.state.page.set(elem.id, elem));
  }
  /**
   * Mutation to set the users to the passed user array (clear the previous users)
   * @param users users the users state is being set to
   */
  setUsers(users: User[]) {
    this.state.users.clear();
    users.forEach((elem) => this.state.users.set(elem.id, elem));

  }
  /**
   * Mutation to set the search result to the passed user array (clear the previous search result)
   * @param users users the search result state is being set to
   */
  setSearchResult(users: User[]) {
    this.state.searchResult.clear();
    users.forEach((elem) => this.state.searchResult.set(elem.id, elem));
  }
  /**
   * Mutation to set the total available users
   * @param total the total to set the total state to
   */
  setTotal(total: number) {
    this.state.total = total;
  }
  /**
   * Mutation to add users or to update users, if they exist, with a set of new users
   * @param users the users to be added or updated in the users state
   */
  addOrUpdateUsers(users: User[]) {
    users.forEach((user) => {
        this.state.users.set(user.id, user);
    });
  }
  /**
   * Mutation to add of update a single user, if they exist
   * @param user the user that should be added to or updated in the user state
   */
  addOrUpdateUser(user: User){
    this.state.users.set(user.id, user);
  }
  /**
   * Mutation to delete a single user
   * @param user the user to be delete from the users state
   */
  deleteUser(user: User) {
    this.state.users.delete(user.id);
  }
  /**
   * Mutation to delete a single user by id
   * @param userId id of the user to be deleted
   */
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

  //reference to the error state to be able to add errors
  errorState: Context<typeof errorState> | undefined;

  // set error state on init of the store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
  }
  /**
   * Action to clear the users and page state
   */
  async clearUsers() {
    this.mutations.setUsers([]);
    this.mutations.setPage([]);
  }
  /**
   * Action to create a user in the backend and add it to the users state
   * @param user user to be created
   */
  async createUser(user: User) {
    const createdUser:ErrorResult<User> = await createUser(undom(user));
    if(createdUser.res && !createdUser.error) {
      this.mutations.addOrUpdateUser(createdUser.res);
    } else {
      handleErrors(createdUser.errorMsg, this.errorState);
    }
  }
  /**
   * Action to update a user in the backend and update it in the users state by retrieving again
   * @param user  user to be updated
   */
  async updateUser(user: User) {
    const userUpdated:ErrorResult<boolean> = await updateUser(undom(user));
    if(userUpdated.res && !userUpdated.error) {
      this.actions.retrieveUserById(user.id);
    } else {
      handleErrors(userUpdated.errorMsg, this.errorState);
    }
  }
  /**
   * Action to update a user's password in the backend. no effect on the state
   * @param param0 {userId, pass} with userId being the id of the user for which the password is being updated and pass is the new password
   */
  async updateUserPasswordById({userId, pass}:{userId: string, pass: string}) {
    const userPasswordUpdated:ErrorResult<boolean> = await updateUserPassword(userId, pass);
    if(!userPasswordUpdated.res && userPasswordUpdated.error) {
      handleErrors(userPasswordUpdated.errorMsg, this.errorState);
    }
  }
  /**
   * Action to delete a user in the backend and delete it in the users state
   * @param userId id of the user to delete
   */
  async deleteUserById(userId: string) {
    const userDeleted: ErrorResult<boolean> = await deleteUser(userId);
    if(userDeleted.res && !userDeleted.error) {
      this.mutations.deleteUserById(userId);
    }  else {
      handleErrors(userDeleted.errorMsg, this.errorState);
    }
  }
  /**
   * Action to retrieve a number of users from the Backend and add it to the users state, set the page to it and set the total.
   * @param param0 {amount,offset,orderBy,orderDir} amount is number of users retrieved, offset is where the
   *                                                retrieval of users starts, orderBy is the user property
   *                                                to use for sorting and orderDir is the direction of the sorting
   */
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
  /**
   * Action to retrieve a user in the backend and add it to the users state
   * @param userId id of the user to be retrieved
   */
  async retrieveUserById(userId: string) {
    const retrievedUser: ErrorResult<User> = await retrieveUser(userId);
    if(retrievedUser.res && !retrievedUser.error) {
      this.mutations.addOrUpdateUser(retrievedUser.res);
    } else {
      handleErrors(retrievedUser.errorMsg, this.errorState);
    }
  }
  /**
   * Action to search users in the backend and add it to the users state and search result state.
   * @param param0 {query, limit, offset} query is the search string, limit is the maximum amount
   *                                      of search results and offset if where to start the search
   */
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