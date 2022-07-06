import type { Store } from 'vuex';
import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import type { Context } from 'vuex-smart-module';
import { createUser, updateUser, deleteUser, retrieveUser, retrieveUsers } from '#preload';
import type { User, ErrorResult } from '../../../../types';
import { errorState } from './ErrorState';

function undom(user: User):User {
  return {...user};
}

/**
 * define the content of the UsersState
 */
class UserState {
  users: User[] = [];
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
}

/**
 * define mutations to change the state
 */
class UserStateMutations extends Mutations<UserState> {
  setUsers(users: User[]) {
    this.state.users = users;
  }
  addUser(user: User) {
    this.state.users = [...this.state.users, user];
  }
  addOrUpdateUser(user: User){
    if (this.state.users.filter((elem) => elem.username === user.username).length > 0) {
      this.state.users = this.state.users.map((elem) => (elem.username === user.username)? user : elem);
    } else {
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

  async createUser(user: User) {
    const createdUser:ErrorResult<User> = await createUser(undom(user));
    if(createdUser.res && !createdUser.error) {
      this.commit('addUser', createdUser.res);
    } else if(this.errorState) {
      this.errorState.dispatch('setError', createdUser.error);
      if(createdUser.errorMsg) {
        this.errorState.dispatch('setErrorMessage', createdUser.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async updateUser(user: User) {
    const userUpdated:ErrorResult<boolean> = await updateUser(undom(user));
    if(userUpdated.res && !userUpdated.error) {
      this.dispatch('retreiveUserById', user.id);
    } else if(this.errorState) {
      this.errorState.dispatch('setError', userUpdated.error);
      if(userUpdated.errorMsg) {
        this.errorState.dispatch('setErrorMessage', userUpdated.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async deleteUserById(userId: string) {
    const userDeleted: ErrorResult<boolean> = await deleteUser(userId);
    if(userDeleted.res && !userDeleted.error) {
      this.commit('deleteUserById', userId);
    } else if(this.errorState) {
      this.errorState.dispatch('setError', userDeleted.error);
      if(userDeleted.errorMsg) {
        this.errorState.dispatch('setErrorMessage', userDeleted.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async retreiveUsers({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedUsers: ErrorResult<User[]> = await retrieveUsers(amount, offset, orderBy, orderDir);
    if(retrievedUsers.res && !retrievedUsers.error) {
      this.commit('setUsers', retrievedUsers.res);
    } else if(this.errorState) {
      this.errorState.dispatch('setError', retrievedUsers.error);
      if(retrievedUsers.errorMsg) {
        this.errorState.dispatch('setErrorMessage', retrievedUsers.errorMsg);
      }
    } else {
      console.error('Missing Error State');
    }
  }
  async retreiveUserById(userId: string) {
    const retrievedUser: ErrorResult<User> = await retrieveUser(userId);
    if(retrievedUser.res && !retrievedUser.error) {
      this.commit('addOrUpdateUser', retrievedUser.res);
    } else if(this.errorState) {
      this.errorState.dispatch('setError', retrievedUser.error);
      if(retrievedUser.errorMsg) {
        this.errorState.dispatch('setErrorMessage', retrievedUser.errorMsg);
      }
    } else {
      console.error('Missing Error State');
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