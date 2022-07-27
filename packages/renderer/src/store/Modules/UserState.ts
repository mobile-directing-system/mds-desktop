import type { Store } from 'vuex';
import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import type { Context } from 'vuex-smart-module';
import { createUser, updateUser, deleteUser, retrieveUser, retrieveUsers } from '#preload';
import type { User, ErrorResult } from '../../../../types';
import { errorState, handleErrors } from './ErrorState';

function undom(user: User):User {
  return {...user};
}

/**
 * define the content of the UsersState
 */
class UserState {
  users: User[] = [];
  page: User[] = [];
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
    this.state.page = users;
  }
  setUsers(users: User[]) {
    this.state.users = users;
  }
  setTotal(total: number) {
    this.state.total = total;
  }
  addOrUpdateUsers(users: User[]) {
    users.map((user) => {
      if (this.state.users.filter((elem) => elem.id === user.id).length > 0) {
        this.state.users = this.state.users.map((elem) => (elem.id === user.id)? user : elem);
      } else{
        this.state.users = [...this.state.users, user];
      }
    });
  }
  addUser(user: User) {
    this.state.users = [...this.state.users, user];
  }
  addOrUpdateUser(user: User){
    if (this.state.users.filter((elem) => elem.id === user.id).length > 0) {
      this.state.users = this.state.users.map((elem) => (elem.id === user.id)? user : elem);
    } else{
      this.state.users = [...this.state.users, user];
    }
  }
  updateUser(user: User) {
    this.state.users = this.state.users.map((elem) => (elem.id === user.id)? user : elem);
  }
  deleteUser(user: User) {
      this.state.users = this.state.users.filter((elem) => elem.id !== user.id);
  }
  deleteUserById(userId: string) {
    this.state.users = this.state.users.filter((elem) => elem.id !== userId);
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
      this.mutations.addUser(createdUser.res);
    } else {
      handleErrors(createdUser.error, createdUser.errorMsg, this.errorState);
    }
  }
  async updateUser(user: User) {
    const userUpdated:ErrorResult<boolean> = await updateUser(undom(user));
    if(userUpdated.res && !userUpdated.error) {
      this.actions.retrieveUserById(user.id);
    } else {
      handleErrors(userUpdated.error, userUpdated.errorMsg, this.errorState);
    }
  }
  async deleteUserById(userId: string) {
    const userDeleted: ErrorResult<boolean> = await deleteUser(userId);
    if(userDeleted.res && !userDeleted.error) {
      this.mutations.deleteUserById(userId);
    }  else {
      handleErrors(userDeleted.error, userDeleted.errorMsg, this.errorState);
    }
  }
  async retrieveUsers({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedUsers: ErrorResult<User[]> = await retrieveUsers(amount, offset, orderBy, orderDir);
    if(retrievedUsers.res && retrievedUsers.total !== undefined && !retrievedUsers.error) {
      this.mutations.setPage(retrievedUsers.res);
      this.mutations.addOrUpdateUsers(retrievedUsers.res);
      this.mutations.setTotal(retrievedUsers.total);
    } else {
      handleErrors(retrievedUsers.error, retrievedUsers.errorMsg, this.errorState);
    }
  }
  async retrieveUserById(userId: string) {
    const retrievedUser: ErrorResult<User> = await retrieveUser(userId);
    if(retrievedUser.res && !retrievedUser.error) {
      this.mutations.addOrUpdateUser(retrievedUser.res);
    } else {
      handleErrors(retrievedUser.error, retrievedUser.errorMsg, this.errorState);
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