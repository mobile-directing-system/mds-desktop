import { PermissionMatcher, PermissionName } from './permissions';

/**
 * Allows group creation.
 * @constructor
 */
export function CreateGroupPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.CreateGroup);
  };
}

/**
 * Allows updating groups.
 * @constructor
 */
export function UpdateGroupPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.UpdateGroup);
  };
}

/**
 * Allows group deletion.
 * @constructor
 */
export function DeleteGroupPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.DeleteGroup);
  };
}

/**
 * Allows viewing group details.
 * @constructor
 */
export function ViewGroupPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.ViewGroup);
  };
}
