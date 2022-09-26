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

//import real backend operation calls
import { createOperation as realCreateOperation } from './operations';
import { updateOperation as realUpdateOperation } from './operations';
import { retrieveOperation as realRetrieveOperation } from './operations';
import { retrieveOperations as realRetrieveOperations } from './operations';
import { searchOperations as realSearchOperations } from './operations';
import { retrieveOperationMembers as realRetrieveOperationMembers } from './operations';
import { updateOperationMembers as realUpdateOperationMembers } from './operations';

//import real backend group calls
import { createGroup as realCreateGroup } from './groups';
import { updateGroup as realUpdateGroup } from './groups';
import { deleteGroup as realDeleteGroup } from './groups';
import { retrieveGroups as realRetrieveGroups } from './groups';
import { retrieveGroup as realRetrieveGroup } from './groups';

//import real backend permisson calls
import {retrievePermissions as realRetrievePermissions} from './permissions';
import { updatePermissions as realUpdatePermissions } from './permissions';

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

//import mocked backend operation calls
import { createOperation as mockedCreateOperation } from './mockedBackend/operations';
import { updateOperation as mockedUpdateOperation } from './mockedBackend/operations';
import { retrieveOperation as mockedRetrieveOperation } from './mockedBackend/operations';
import { retrieveOperations as mockedRetrieveOperations } from './mockedBackend/operations';
import { searchOperations as mockedSearchOperations } from './mockedBackend/operations';
import { retrieveOperationMembers as mockedRetrieveOperationMembers } from './mockedBackend/operations';
import { updateOperationMembers as mockedUpdateOperationMembers } from './mockedBackend/operations';

//import mocked backend group calls
import { createGroup as mockedCreateGroup } from './mockedBackend/groups';
import { updateGroup as mockedUpdateGroup } from './mockedBackend/groups';
import { deleteGroup as mockedDeleteGroup } from './mockedBackend/groups';
import { retrieveGroups as mockedRetrieveGroups } from './mockedBackend/groups';
import { retrieveGroup as mockedRetrieveGroup } from './mockedBackend/groups';

//import mocked backend permission calls
import {retrievePermissions as mockedRetrievePermissions} from './mockedBackend/permissions';
import { updatePermissions as mockedUpdatePermissions } from './mockedBackend/permissions';

export { createAddressbookEntry, updateAddressbookEntry, deleteAddressbookEntry, retrieveAddressbookEntries, retrieveAddressbookEntry, searchAddressbookEntryByQuery, setChannels, retrieveChannels } from './addressbook';
export{ createIntel, invalidateIntel, searchIntelByQuery, retrieveIntel, retrieveMultipleIntel} from './intel';

//login calls
export const login = config.mockedBackend? mockedLogin : realLogin;
export const logout = config.mockedBackend? mockedLogout : realLogout;

//user calls
export const createUser = config.mockedBackend? mockedCreateUser : realCreateUser;
export const updateUser = config.mockedBackend? mockedUpdateUser : realUpdateUser;
export const updateUserPassword = config.mockedBackend? mockedUpdateUserPassword : realUpdateUserPassword;
export const retrieveUser = config.mockedBackend? mockedRetrieveUser : realRetrieveUser;
export const retrieveUsers = config.mockedBackend? mockedRetrieveUsers : realRetrieveUsers;
export const deleteUser = config.mockedBackend? mockedDeleteUser : realDeleteUser;
export const searchUsers = config.mockedBackend? mockedSearchUsers : realSearchUsers;

//operation calls
export const createOperation = config.mockedBackend? mockedCreateOperation : realCreateOperation;
export const updateOperation = config.mockedBackend? mockedUpdateOperation : realUpdateOperation;
export const retrieveOperation = config.mockedBackend? mockedRetrieveOperation : realRetrieveOperation;
export const retrieveOperations = config.mockedBackend? mockedRetrieveOperations : realRetrieveOperations;
export const searchOperations = config.mockedBackend? mockedSearchOperations : realSearchOperations;
export const retrieveOperationMembers = config.mockedBackend? mockedRetrieveOperationMembers: realRetrieveOperationMembers;
export const updateOperationMembers = config.mockedBackend? mockedUpdateOperationMembers: realUpdateOperationMembers;

//group calls
export const createGroup = config.mockedBackend? mockedCreateGroup : realCreateGroup;
export const updateGroup = config.mockedBackend? mockedUpdateGroup : realUpdateGroup;
export const deleteGroup = config.mockedBackend? mockedDeleteGroup : realDeleteGroup;
export const retrieveGroup = config.mockedBackend? mockedRetrieveGroup : realRetrieveGroup;
export const retrieveGroups = config.mockedBackend? mockedRetrieveGroups : realRetrieveGroups;

//permission calls
export const retrievePermissions = config.mockedBackend? mockedRetrievePermissions: realRetrievePermissions;
export const updatePermissions = config.mockedBackend? mockedUpdatePermissions: realUpdatePermissions;








