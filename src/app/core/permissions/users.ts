import { PermissionMatcher, PermissionName } from './permissions';

/**
 * Allows user creation.
 * @constructor
 */
export function CreateUserPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.CreateUser);
  };
}

/**
 * Allows updating users.
 * @constructor
 */
export function UpdateUserPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.UpdateUser);
  };
}

/**
 * Allows viewing user details.
 * @constructor
 */
export function ViewUserPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.ViewUser);
  };
}

/**
 * Allows updating user's passwords.
 * @constructor
 */
export function UpdateUserPassPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.UpdateUserPass);
  };
}

/**
 * Allows changing admin-state of users.
 * @constructor
 */
export function SetUserAdminPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.SetUserAdmin);
  };
}

/**
 * Allows (de)activating users.
 * @constructor
 */
export function SetUserActiveStatePermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.SetUserActiveState);
  };
}
