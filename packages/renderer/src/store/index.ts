import { Module, createStore } from 'vuex-smart-module';
import { loginInfo } from './Modules/LoginInfo';
import { useLoginInfo } from './Modules/LoginInfo';

/**
 * define empty root state for the store to contain
 * the modules
 */
const root = new Module({
  modules: {
    loginInfo,
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
export { useLoginInfo };