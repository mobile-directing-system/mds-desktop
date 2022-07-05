import { Module, createStore } from 'vuex-smart-module';
import { loginState, useLoginState } from './Modules/LoginState';
import { userState, useUserState } from './Modules/UserState';
import { permissionsState, usePermissionsState } from './Modules/PermissionsState';

/**
 * define empty root state for the store to contain
 * the modules
 */
const root = new Module({
  modules: {
    loginState,
    userState,
    permissionsState,
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
export { useLoginState, useUserState, usePermissionsState };