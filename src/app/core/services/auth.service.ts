import { Injectable } from '@angular/core';
import { NetService } from './net.service';
import { finalize, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MDSError, MDSErrorCode } from '../util/errors';

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

  constructor(private netService: NetService) {
  }

  /**
   * Logs in the user with the given username and password.
   * @param username The user's username.
   * @param pass The user's password in plaintext.
   */
  login(username: string, pass: string): Observable<boolean> {
    if (!!this.loggedInUserId) {
      throw new MDSError(MDSErrorCode.AppError, 'user already logged in');
    }
    return this.netService.postJSON<NetUserToken>('/login', {
      username: username,
      pass: pass,
    }, {}).pipe(
      // Set user id.
      tap((token: NetUserToken) => {
        this.loggedInUserId = token.user_id;
      }),
      // Set Authorization-header in net-service.
      tap((token: NetUserToken) => {
        const header = `${ token.token_type } ${ token.access_token }`;
        this.netService.requestHeaders = this.netService.requestHeaders.set('Authorization', header);
      }),
      map((_) => true),
    );
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
        this.loggedInUserId = undefined
        this.netService.requestHeaders = this.netService.requestHeaders.delete('Authorization');
      }),
    );
  }

  loggedInUser(): string | undefined {
    return this.loggedInUserId;
  }
}
