import { Injectable } from '@angular/core';
import { NetService } from './net.service';
import { BehaviorSubject, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MDSError, MDSErrorCode } from '../util/errors';
import { LocalStorageService } from './local-storage.service';

/**
 * The user token returned when logging in.
 */
interface NetUserToken {
  user_id: string;
  access_token: string;
  token_type: string;
}

/**
 * Service for performing authentication with the server. Uses and sets headers of {@link NetService}.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * The id of the user when logged in. Set via {@link setLoggedInUserId}.
   * @private
   */
  private loggedInUserId?: string;
  private _userChange = new BehaviorSubject<string | undefined>(undefined);
  private _authTokenChange = new BehaviorSubject<string | undefined>(undefined);

  constructor(private netService: NetService, private lsService: LocalStorageService) {
    // Assure server url set as otherwise we do not have anything to do.
    if (lsService.getItem(LocalStorageService.TokenServerURL) === null) {
      return;
    }
    // Check auth and redirect to login-page if not ok.
    const authToken = lsService.getItem(LocalStorageService.TokenAuthToken);
    const loggedInUserId = lsService.getItem(LocalStorageService.TokenLoggedInUserId);
    if (authToken !== null && loggedInUserId !== null) {
      this.applyAuthToken(authToken);
      this.setLoggedInUserId(loggedInUserId);
    }
  }

  private setLoggedInUserId(newId: string | undefined): void {
    this.loggedInUserId = newId;
    this._userChange.next(newId);
  }

  /**
   * Logs in the user with the given username and password.
   * @param username The user's username.
   * @param pass The user's password in plaintext.
   */
  login(username: string, pass: string): Observable<boolean> {
    return (!!this.loggedInUserId ? this.logout() : of(void 0)).pipe(
      catchError(() => of(void 0)), // Ignore.
      switchMap(() => this.netService.postJSON<NetUserToken>('/login', {
        username: username,
        pass: pass,
      }, {})),
      tap((token: NetUserToken) => {
        // Save user id and token.
        this.lsService.setItem(LocalStorageService.TokenLoggedInUserId, token.user_id);
        this.lsService.setItem(LocalStorageService.TokenAuthToken, token.access_token);
        // Set Authorization-header in net-service.
        this.applyAuthToken(token.access_token);
        // Set user id and notify. This needs to happen after applying the token as subscribers might use the
        // net-service immediately.
        this.setLoggedInUserId(token.user_id);
      }),
      // Success.
      map(() => true),
    );
  }

  /**
   * Applies the given access token to the net service.
   * @param token The token.
   * @private
   */
  private applyAuthToken(token: string): void {
    const header = `Bearer ${ token }`;
    this.netService.requestHeaders = this.netService.requestHeaders.set('Authorization', header);
    this._authTokenChange.next(token)
  }

  /**
   * Logs out the currently logged-in user.
   */
  logout(): Observable<void> {
    if (!this.loggedInUserId) {
      throw new MDSError(MDSErrorCode.AppError, 'user not logged in');
    }
    return this.netService.post<void>('/logout', {}).pipe(
      // Delete Authorization-header form net-service.
      finalize(() => {
        this.setLoggedInUserId(undefined);
        this._authTokenChange.next(undefined)
        this.netService.requestHeaders = this.netService.requestHeaders.delete('Authorization');
        this.lsService.removeItem(LocalStorageService.TokenAuthToken);
        this.lsService.removeItem(LocalStorageService.TokenLoggedInUserId);
      }),
    );
  }

  loggedInUser(): string | undefined {
    return this.loggedInUserId;
  }

  /**
   * Returns an observable that receives the user id when the logged-in user changes.
   */
  userChange(): Observable<string | undefined> {
    return this._userChange.asObservable();
  }

  /**
   * Returns an observable that receives the authentication token when changed.
   */
  authTokenChange(): Observable<string | undefined> {
    return this._authTokenChange.asObservable();
  }

  clearLogin() {
    if (!!this.loggedInUserId) {
      this.logout();
    }
  }
}
