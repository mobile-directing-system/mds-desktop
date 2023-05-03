import { PermissionMatcher, PermissionName } from './permissions';

/**
 * Allows address book entry creation.
 * @constructor
 */
export function CreateAddressBookEntryPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.CreateAnyAddressBookEntry);
  }
}

/**
 * Allows updating address book entries.
 * @constructor
 */
export function UpdateAddressBookEntryPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.UpdateAnyAddressBookEntry);
  }
}

/**
 * Allows viewing address book entries.
 * @constructor
 */
export function ViewAddressBookEntryPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.ViewAnyAddressBookEntry);
  }
}

/**
 * Allows deleting address book entries.
 * @constructor
 */
export function DeleteAddressBookEntryPermission(): PermissionMatcher {
  return granted => {
    return granted.some(p => p.name === PermissionName.DeleteAnyAddressBookEntry);
  }
}
