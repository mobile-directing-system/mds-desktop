import { PermissionMatcher, PermissionName } from './permissions';

/**
 * Allows scheduling intel deliveries and managing ongoing ones.
 * @constructor
 */
export function ManageIntelDelivery(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.ManageIntelDelivery);
  };
}
