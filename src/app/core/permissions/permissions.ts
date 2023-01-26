import { Observable } from 'rxjs';

/**
 * Defines all Permissions.
 */
export enum PermissionName {
  /**
   * Allows setting permissions for users.
   */
  UpdatePermissions = 'permissions.update',
  /**
   * Allows retrieving permissions of users.
   */
  ViewPermissions = 'permissions.view',
  /**
   * Allows creating address book entries, that can also be global or associated to foreign users.
   * This also includes associating entries with operations, the target user or the requesting client is not part of.
   */
  CreateAnyAddressBookEntry = 'logistics.address-book.entry.create.any',
  /**
   * Allows updating address book entries, that can also be global or associated to foreign users.
   * This also includes associating entries with operations, the target user or the requesting client is not part of.
   */
  UpdateAnyAddressBookEntry = 'logistics.address-book.entry.update.any',
  /**
   * Allows deletion of address book entries, that can also be global or associated to foreign users.
   * This also includes associating entries with operations, the requesting client is not part of.
   */
  DeleteAnyAddressBookEntry = 'logistics.address-book.entry.delete.any',
  /**
   * Allows retrieval of all address book entries, including that can also be global or associated to foreign users.
   * This also includes associating entries with operations, the requesting client is not part of.
   */
  ViewAnyAddressBookEntry = 'logistics.address-book.entry.view.any',
  /**
   * Allows creating groups.
   */
  CreateGroup = 'group.create',
  /**
   * Allows updating groups.
   */
  UpdateGroup = 'group.update',
  /**
   * Allows deleting groups.
   */
  DeleteGroup = 'group.delete',
  /**
   * Allows retrieval of groups.
   */
  ViewGroup = 'group.view',
  /**
   * Allows creating intel.
   */
  CreateIntel = 'intelligence.intel.create',
  /**
   * Allows invalidating intel.
   */
  InvalidateIntel = 'intelligence.intel.invalidate',
  /**
   * Allows to view intel.
   */
  ViewAnyIntel = 'intelligence.intel.view.any',
  /**
   * Allows to retrieve operations.
   */
  ViewAnyOperation = 'operation.view.any',
  /**
   * Allows to create operations.
   */
  CreateOperation = 'operation.create',
  /**
   * Allows to update operations.
   */
  UpdateOperation = 'operation.update',
  /**
   * Allows to retrieve the members of an operation.
   */
  ViewOperationMembers = 'operation.members.view',
  /**
   * Allows to update the members of an operation.
   */
  UpdateOperationMembers = 'operation.members.update',
  /**
   * Allows to create users.
   */
  CreateUser = 'user.create',
  /**
   * Allows to set users inactive.
   */
  SetUserActiveState = 'user.set-active-state',
  /**
   * Allows to set a user as admin.
   */
  SetUserAdmin = 'user.set-admin',
  /**
   * Allows to update a user.
   */
  UpdateUser = 'user.update',
  /**
   * Allows to update the password of a user.
   */
  UpdateUserPass = 'user.update-pass',
  /**
   * Allows to retrieve users.
   */
  ViewUser = 'user.view',
}

/**
 * Permission that is associated in an array for each individual user.
 */
export interface Permission {
  /**
   * Name of the permission.
   */
  name: string,
  /**
   * Additional options.
   */
  options?: object,
}

/**
 * Returns `true` when permission is granted.
 * @param granted Granted permissions, the matcher might use for checking.
 * @constructor
 */
export type PermissionMatcher = (granted: Permission[]) => Observable<boolean> | boolean


/**
 * Allows setting permissions for users.
 * @constructor
 */
export function UpdatePermissionPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.UpdatePermissions);
  };
}

/**
 * Allows viewing permissions for users.
 * @constructor
 */
export function ViewPermissionsPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.ViewPermissions);
  };
}
