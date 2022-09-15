import config from '/@/config';

//import real backend login calls
import { login as realLogin } from './login';
import { logout as realLogout } from './login';

//import real backend user calls
import { createUser as realCreateUser } from './users';
import { updateUser as realUpdateUser } from './users';
import { updateUserPassword as realUpdateUserPassword } from './users';
import { retrieveUser as realRetrieveUser } from './users';
import { retrieveUsers as realRetrieveUsers } from './users';
import { deleteUser as realDeleteUser } from './users';
import { searchUsers as realSearchUsers } from './users';

//import mocked backend login calls
import { login as mockedLogin } from './mockedBackend/login';
import { logout as mockedLogout } from './mockedBackend/login';

//import mocked backend user calls
import { createUser as mockedCreateUser } from './mockedBackend/users';
import { updateUser as mockedUpdateUser } from './mockedBackend/users';
import { updateUserPassword as mockedUpdateUserPassword } from './mockedBackend/users';
import { retrieveUser as mockedRetrieveUser } from './mockedBackend/users';
import { retrieveUsers as mockedRetrieveUsers } from './mockedBackend/users';
import { deleteUser as mockedDeleteUser } from './mockedBackend/users';
import { searchUsers as mockedSearchUsers } from './mockedBackend/users';

export { createGroup, updateGroup, deleteGroup, retrieveGroups, retrieveGroup } from './groups';
export { createOperation, updateOperation, retrieveOperation, retrieveOperations, searchOperations, retrieveOperationMembers, updateOperationMembers } from './operations';
export { retrievePermissions, updatePermissions } from './permissions';

export { createAddressbookEntry, updateAddressbookEntry, deleteAddressbookEntry, retrieveAddressbookEntries, retrieveAddressbookEntry, searchAddressbookEntryByQuery, setChannels, retrieveChannels } from './addressbook';
export const login = config.mockedBackend? mockedLogin : realLogin;
export const logout = config.mockedBackend? mockedLogout : realLogout;

export const createUser = config.mockedBackend? mockedCreateUser : realCreateUser;
export const updateUser = config.mockedBackend? mockedUpdateUser : realUpdateUser;
export const updateUserPassword = config.mockedBackend? mockedUpdateUserPassword : realUpdateUserPassword;
export const retrieveUser = config.mockedBackend? mockedRetrieveUser : realRetrieveUser;
export const retrieveUsers = config.mockedBackend? mockedRetrieveUsers : realRetrieveUsers;
export const deleteUser = config.mockedBackend? mockedDeleteUser : realDeleteUser;
export const searchUsers = config.mockedBackend? mockedSearchUsers : realSearchUsers;




