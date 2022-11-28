/**
 * Defines all Permissions.
 */
export enum Permissions{
  /**
   * Allows setting permissions for users.
   */
  PermissionsUpdate = 'permissions.update',
  /**
   * Allows retrieving permissions of users.
   */
  PermissionsView = 'permissions.view',
  /**
   * Allows creating address book entries, that can also be global or associated to foreign users.
   * This also includes associating entries with operations, the target user or the requesting client is not part of.
   */
  AddressBookCreateAny = 'logistics.address-book.entry.create.any',
  /**
   * Allows updating address book entries, that can also be global or associated to foreign users.
   * This also includes associating entries with operations, the target user or the requesting client is not part of.
   */
  AddressBookUpdateAny = 'logistics.address-book.entry.update.any',
  /**
   * Allows deletion of address book entries, that can also be global or associated to foreign users.
   * This also includes associating entries with operations, the requesting client is not part of.
   */
  AddressBookDeleteAny = 'logistics.address-book.entry.delete.any',
  /**
   * Allows retrieval of all address book entries, including that can also be global or associated to foreign users.
   * This also includes associating entries with operations, the requesting client is not part of.
   */
  AddressBookViewAny = 'logistics.address-book.entry.view.any',
  /**
   * Allows to create Groups.
   */
  GroupCreate = 'group.create',
  /**
   * Allows to update Groups.
   */
  GroupUpdate = 'group.update',
  /**
   * Allows to delete Groups.
   */
  GroupDelete = 'group.delete',
  /**
   * Allows to retrieve Groups.
   */
  GroupView = 'group.view',
  /**
   * Allows to create intel.
   */
  IntelCreate = 'intelligence.intel.create',
  /**
   * Allows invalidating intel.
   */
  IntelInvalidate = 'intelligence.intel.invalidate',
  /**
   * Allows to view intel.
   */
  IntelViewAny = 'intelligence.intel.view.any',
  /**
   * Allows to retrieve operations.
   */
  OperationViewAny = 'operation.view.any',
  /**
   * Allows to create operations.
   */
  OperationCreate = 'operation.create',
  /**
   * Allows to update operations.
   */
  OperationUpdate = 'operation.update',
  /**
   * Allows to retrieve the members of an operation.
   */
  OperationMembersView = 'operation.members.view',
  /**
   * Allows to update the members of an operation.
   */
  OperationMembersUpdate = 'operation.members.update',
  /**
   * Allows to create users.
   */
  UserCreate = 'user.create',
  /**
   * Allows to set users inactive.
   */
  UserSetActiveState = 'user.set-active-state',
  /**
   * Allows to set a user as admin.
   */
  UserSetAdmin = 'user.set-admin',
  /**
   * Allows to update a user.
   */
  UserUpdate = 'user.update',
  /**
   * Allows to update the password of a user.
   */
  UserUpdatePass = 'user.update-pass',
  /**
   * Allows to retrieve users.
   */
  UserView = 'user.view',
}

/**
 * Permission that is associated in an array for each individual user.
 */
export interface Permission {
  /**
   * name of the permission
   */
  name : string,
  /**
   * Additional options.
   */
  option?: object,
}
