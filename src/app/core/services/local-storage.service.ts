import { Injectable } from '@angular/core';

/**
 * Wrapper for {@link localStorage} in order to provide better control and testability.
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   * Holds the server URL for communicating with the server.
   */
  static TokenServerURL = 'server-url';
  /**
   * Holds the auth token for the user.
   */
  static TokenAuthToken = 'auth-token';
  /**
   * The id of the user being logged in.
   */
  static TokenLoggedInUserId = 'logged-in-user-id';
  /**
   * The id of the currently selected operation.
   */
  static TokenWorkspaceOperation = 'workspace-operation';

  /**
   * Assembles the final key for local storage with prefix.
   * @param key The actual key.
   * @private
   */
  private static createLocalStorageKey(key: string): string {
    return `mds-desktop__${ key }`;
  }

  /**
   * Sets the given item in {@link localStorage}.
   * @param key The key for the item.
   * @param value The actual item value.
   */
  setItem(key: string, value: string): void {
    localStorage.setItem(LocalStorageService.createLocalStorageKey(key), value);
  }

  /**
   * Retrieves the item with the given key from {@link localStorage}.
   * @param key The key for the item.
   */
  getItem(key: string): string | null {
    return localStorage.getItem(LocalStorageService.createLocalStorageKey(key));
  }

  /**
   * Removes the item with the given key from {@link localStorage}.
   * @param key The key for the item.
   */
  removeItem(key: string): void {
    localStorage.removeItem(LocalStorageService.createLocalStorageKey(key));
  }
}
