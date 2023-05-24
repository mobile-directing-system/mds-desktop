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

/**
 *
 *  Allows retrieving next radio delivery to deliver,
 *  releasing picked up radio delivery and finish picked up radio delivery.
 * @constructor
 */
export function RadioDeliveryPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.RadioDelivery);
  };
}
