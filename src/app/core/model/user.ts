/**
 * Used for creating a {@link User}.
 */
export interface CreateUser {
  /**
   * Username of the user for logging in.
   */
  username: string;
  /**
   * First name of the user for better readability.
   */
  firstName: string;
  /**
   * Last name of the user for better readability.
   */
  lastName: string;
  /**
   * Whether the user has admin privileges and therefore all permissions.
   */
  isAdmin: boolean;
  /**
   * The initial password for the user.
   */
  initialPass: string;
}

/**
 * Each client logs in and acquires the identity of a user. A user has certain permissions and many entities are
 * associated with a user.
 */
export interface User {
  /**
   * Identifies the user.
   */
  id: string;
  /**
   * Username of the user for logging in.
   */
  username: string;
  /**
   * First name of the user for better readability.
   */
  firstName: string;
  /**
   * Last name of the user for better readability.
   */
  lastName: string;
  /**
   * Whether the user has admin privileges and therefore all permissions.
   */
  isAdmin: boolean;
  /**
   * Whether the user is active or inactive. This should forbid logging in.
   */
  isActive: boolean;
}
