import { User } from './user';

/**
 * Used for creating an {@link AddressBookEntry}
 */
export interface CreateAddressBookEntry {
  /**
   * Descriptive label.
   */
  label: string,
  /**
   * Description of the entry. Holds further human-readable information.
   */
  description: string,
  /**
   * Id of the optionally associated {@link Operation}.
   */
  operation?: string | undefined,
  /**
   * Id of the optionally associated {@link User}.
   */
  user?: string | undefined,
}

/**
 * Address-book-entries contain  further personalized information about {@link User} and {@link Operation}.
 */
export interface AddressBookEntry {
  /**
   * Identifies the entry.
   */
  id: string,
  /**
   * Descriptive label.
   */
  label: string,
  /**
   * Description of the entry. Holds further human-readable information.
   */
  description: string,
  /**
   * Id of the optionally associated {@link Operation}.
   */
  operation?: string | undefined,
  /**
   * Id of the optionally associated {@link User}.
   */
  user?: string | undefined,
  /**
   * Details of the optionally associated {@link User}
   */
  userDetails?: User | null
}
