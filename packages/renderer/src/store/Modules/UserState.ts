import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { createUser, updateUser, deleteUser, retrieveUser, retrieveUsers } from '#preload';
import type { User, CachedResult } from '../../../../types';


/**
 * define the content of the UsersState
 */
class UserState {
  users: User[] = [];
  cachedUsers: Map<string, boolean> = new Map();
  error = false;
  errorMsg = '';
}

/**
 * define getters to access the state
 */
class UserStateGetters extends Getters<UserState> {
  get getUsers() {
    return () => {
      return this.state.users;
    };
  }
  get CachedUsers() {
    return () => {
      return this.state.cachedUsers;
    };
  }
  get error() {
    return () => {
      return this.state.error;
    };
  }
  get errorMsg() {
    return () => {
      if(this.state.errorMsg !== '') {
        return this.state.errorMsg;
      } else if (this.state.error) {
        return 'There was an error during a call to the /users endpoint.';
      } else {
        return '';
      }
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
  addUser({user, cached}:{user: User, cached: boolean}) {
    if(cached) {
        this.state.cachedUsers.set(user.id, true);
    }
    this.state.users = [...this.state.users, user];
  }
  addOrUpdateUser({user, cached}: {user: User, cached: boolean}){
    if(cached) {
        this.state.cachedUsers.set(user.id, true);
    }
    if (this.state.users.filter((elem) => elem.username === user.username).length > 0) {
      this.state.users = this.state.users.map((elem) => (elem.username === user.username)? user : elem);
    } else {
      this.state.users = [...this.state.users, user];
    }
  }
  updateUser({user, cached}: {user: User, cached: boolean}) {
    if(cached) {
        this.state.cachedUsers.set(user.id, true);
    }
    this.state.users = this.state.users.map((elem) => (elem.id === user.id)? user : elem);
  }
  deleteUser(user: User) {
      this.state.users = this.state.users.filter((elem) => elem.id !== user.id);
      this.state.cachedUsers.delete(user.id);
  }
  deleteUserById(userId: string) {
    this.state.users = this.state.users.filter((elem) => elem.id !== userId);
      this.state.cachedUsers.delete(userId);
  }
  setError(error: boolean) {
    this.state.error = error;
  }
  setErrorMsg(errorMsg: string) {
    this.state.errorMsg = errorMsg;
  }
}

/**
 * define actions for functions which change the state as a side effect.
 */
class UserStateActions extends Actions<UserState, UserStateGetters, UserStateMutations, UserStateActions> {
  async createUser(user: User) {
    const createdUser:CachedResult<User> = await createUser(user);
    if(createdUser.res && !createdUser.error) {
      this.commit('addUser', {user: createdUser.res, cached: createdUser.cached});
    } else {
        this.commit('setError', true);
        if(createdUser.errorMsg) {
          this.commit('setErrorMsg', createdUser.errorMsg);
        }
    }
  }
  async updateUser(user: User) {
    const userUpdated:CachedResult<boolean> = await updateUser(user);
    if(userUpdated.res && !userUpdated.error) {
      this.commit('updateUser', {user, cached: userUpdated.cached});
    } else {
      this.commit('setError', true);
      if(userUpdated.errorMsg) {
        this.commit('setErrorMsg', userUpdated.errorMsg);
      }
    }
  }
  async deleteUserById(userId: string) {
    const userDeleted: CachedResult<boolean> = await deleteUser(userId);
    if(userDeleted.res && !userDeleted.error) {
      this.commit('deleteUserById', userId);
    } else {
      this.commit('setError', true);
      if(userDeleted.errorMsg) {
        this.commit('setErrorMsg', userDeleted.errorMsg);
      }
    }
  }
  async retreiveUsers({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}) {
    const retrievedUsers: CachedResult<User[]> = await retrieveUsers(amount, offset, orderBy, orderDir);
    if(retrievedUsers.res && !retrievedUsers.error) {
      this.commit('setUsers', retrievedUsers.res);
    } else {
      this.commit('setError', true);
      if(retrievedUsers.errorMsg) {
        this.commit('setErrorMsg', retrievedUsers.errorMsg);
      }
    }
  }
  async retreiveUserById(userId: string) {
    const retrievedUser: CachedResult<User> = await retrieveUser(userId);
    if(retrievedUser.res && !retrievedUser.error) {
      this.commit('addOrUpdateUser', {user: retrievedUser.res, cached: retrievedUser.cached});
    } else {
      this.commit('setError', true);
      if(retrievedUser.errorMsg) {
        this.commit('setErrorMsg', retrievedUser.errorMsg);
      }
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