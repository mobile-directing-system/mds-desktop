import { PermissionMatcher, PermissionName } from './permissions';

/**
 * Allows operation creation.
 * @constructor
 */
export function CreateOperationPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.CreateOperation);
  };
}

/**
 * Allows updating operations.
 * @constructor
 */
export function UpdateOperationPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.UpdateOperation);
  };
}

/**
 * Allows viewing operation details of any known operation.
 * @constructor
 */
export function ViewAnyOperationPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.ViewAnyOperation);
  };
}

/**
 * Allows retrieving which members belong to operations for any known operation.
 * @constructor
 */
export function ViewOperationMembersPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.ViewOperationMembers);
  };
}

/**
 * Allows setting operation members for any known operation.
 * @constructor
 */
export function UpdateOperationMembersPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.UpdateOperationMembers);
  };
}
