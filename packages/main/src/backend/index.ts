import config from '/@/config';
import { login as realLogin } from './login';
import { login as mockedLogin } from './mockedBackend/login';
import { logout as realLogout } from './login';
import { logout as mockedLogout } from './mockedBackend/login';

console.log(config.mockedBackend);

export { createUser, updateUser, updateUserPassword, retrieveUser, retrieveUsers, deleteUser, searchUsers } from './users';
export { createGroup, updateGroup, deleteGroup, retrieveGroups, retrieveGroup } from './groups';
export { createOperation, updateOperation, retrieveOperation, retrieveOperations, searchOperations, retrieveOperationMembers, updateOperationMembers } from './operations';
export { retrievePermissions, updatePermissions } from './permissions';
//export {login, logout} from './mockedBackend/login';
//export { login, logout } from './login';
export const login = config.mockedBackend? mockedLogin : realLogin;
export const logout = config.mockedBackend? mockedLogout : realLogout;

