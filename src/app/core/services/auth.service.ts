import { Injectable } from '@angular/core';
import { NetService } from './net.service';
import { finalize, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
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
   * The id of the user when logged in.
   * @private
   */
  private loggedInUserId?: string;

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
      this.loggedInUserId = loggedInUserId;
    }
  }

  /**
   * Logs in the user with the given username and password.
   * @param username The user's username.
   * @param pass The user's password in plaintext.
   */
  login(username: string, pass: string): Observable<boolean> {
    if (!!this.loggedInUserId) {
      throw new MDSError(MDSErrorCode.AppError, 'user already logged in', { loggedInUserId: this.loggedInUserId });
    }
    return this.netService.postJSON<NetUserToken>('/login', {
      username: username,
      pass: pass,
    }, {}).pipe(
      // Set user id.
      tap((token: NetUserToken) => {
        this.loggedInUserId = token.user_id;
        this.lsService.setItem(LocalStorageService.TokenLoggedInUserId, token.user_id);
        this.lsService.setItem(LocalStorageService.TokenAuthToken, token.access_token);
      }),
      // Set Authorization-header in net-service.
      tap((token: NetUserToken) => (this.applyAuthToken(token.access_token))),
      map((_) => true),
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
        this.loggedInUserId = undefined;
        this.netService.requestHeaders = this.netService.requestHeaders.delete('Authorization');
        this.lsService.removeItem(LocalStorageService.TokenAuthToken);
        this.lsService.removeItem(LocalStorageService.TokenLoggedInUserId);
      }),
    );
  }

  loggedInUser(): string | undefined {
    return this.loggedInUserId;
  }

  clearLogin() {
    if (!!this.loggedInUserId) {
      this.logout();
    }

  }
}
