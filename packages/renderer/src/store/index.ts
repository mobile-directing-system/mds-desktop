import { Module, createStore } from 'vuex-smart-module';
import { errorState, useErrorState } from './Modules/ErrorState'; //import of ErrorState must be first so that it exsits for all other Modules
import { loginState, useLoginState } from './Modules/LoginState';
import { userState, useUserState } from './Modules/UserState';
import { permissionsState, usePermissionsState } from './Modules/PermissionsState';
import { operationsState, useOperationsState } from './Modules/OperationsState';
import { groupState, useGroupState } from './Modules/GroupState';

/**
 * define empty root state for the store to contain
 * the modules
 */
const root = new Module({
  modules: {
    errorState, //errorState must be first Here so that it exsits for all other Modules
    loginState,
    userState,
    permissionsState,
    operationsState,
    groupState,
  },
});

/**
 * export modulesStore to use it in the app
 */
export const modulesStore = createStore(
  root,
);

/**
 * re-export useLoginInfo function from ./Modules/LoginInfo
 * to simplify the importation in .vue files
 */
export { useLoginState, useUserState, usePermissionsState, useErrorState, useOperationsState, useGroupState };