import { Injectable } from '@angular/core';
import { NetService } from './net.service';
import { CreateUser, User } from '../model/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paginated, PaginationParams, SearchParams, SearchResult } from '../util/store';
import {
  NetPaginated,
  netPaginationParams,
  netSearchParams,
  NetSearchResult,
  paginatedFromNet,
  searchResultFromNet,
} from '../util/net';
import { MDSError, MDSErrorCode } from '../util/errors';
import urlJoin from 'url-join';

/**
 * Fields for sorting users.
 */
export enum UserSort {
  ByUsername,
  ByFirstName,
  ByLastName,
  ByIsAdmin
}

/**
 * Service for user management. Allows creation, manipulation and retrieval of users.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private netService: NetService) {
  }

  /**
   * Creates the given user and returns the created one.
   * @param create The details for user creation.
   */
  createUser(create: CreateUser): Observable<User> {
    interface NetCreate {
      username: string;
      first_name: string;
      last_name: string;
      is_admin: boolean;
      pass: string;
    }

    interface NetCreated {
      id: string;
      username: string;
      first_name: string;
      last_name: string;
      is_admin: boolean;
      is_active: boolean;
    }

    const body: NetCreate = {
      username: create.username,
      first_name: create.firstName,
      last_name: create.lastName,
      is_admin: create.isAdmin,
      pass: create.initialPass,
    };
    return this.netService.postJSON<NetCreated>('/users', body, {}).pipe(
      map((res: NetCreated): User => ({
        id: res.id,
        username: res.username,
        firstName: res.first_name,
        lastName: res.last_name,
        isAdmin: res.is_admin,
        isActive: res.is_active,
      })),
    );
  }

  /**
   * Updates the given user, identified by its {@link User.id}.
   * @param update The updated user.
   */
  updateUser(update: User): Observable<void> {
    interface NetUpdate {
      id: string;
      username: string;
      first_name: string;
      last_name: string;
      is_admin: boolean;
      is_active: boolean;
    }

    const body: NetUpdate = {
      id: update.id,
      username: update.username,
      first_name: update.firstName,
      last_name: update.lastName,
      is_admin: update.isAdmin,
      is_active: update.isActive,
    };
    return this.netService.putJSON(urlJoin('/users', update.id), body, {});
  }

  /**
   * Updates the password for the given user.
   * @param userId The id (NOT the username) of the user to update the password for.
   * @param newPass The new password in plaintext.
   */
  updateUserPass(userId: string, newPass: string): Observable<void> {
    interface NetUpdate {
      user_id: string;
      new_pass: string;
    }

    const body: NetUpdate = {
      user_id: userId,
      new_pass: newPass,
    };
    return this.netService.putJSON(urlJoin('/users', userId, 'pass'), body, {});
  }

  /**
   * Retrieves the user with the given id.
   * @param userId The id of the user to retrieve.
   */
  getUserById(userId: string): Observable<User> {
    interface NetUser {
      id: string;
      username: string;
      first_name: string;
      last_name: string;
      is_admin: boolean;
      is_active: boolean;
    }

    return this.netService.get<NetUser>(urlJoin('/users', userId), {}).pipe(
      map((res: NetUser): User => ({
        id: res.id,
        username: res.username,
        firstName: res.first_name,
        lastName: res.last_name,
        isAdmin: res.is_admin,
        isActive: res.is_active,
      })),
    );
  }

  /**
   * Retrieves a paginated user list with the given params.
   * @param params The pagination params.
   */
  getUsers(params: PaginationParams<UserSort>): Observable<Paginated<User>> {
    interface NetEntry {
      id: string;
      username: string;
      first_name: string;
      last_name: string;
      is_admin: boolean;
      is_active: boolean;
    }

    const nParams = netPaginationParams(params, (by: UserSort) => {
      switch (by) {
        case UserSort.ByUsername:
          return 'username';
        case UserSort.ByFirstName:
          return 'first_name';
        case UserSort.ByLastName:
          return 'last_name';
        case UserSort.ByIsAdmin:
          return 'is_admin';
        default:
          throw new MDSError(MDSErrorCode.AppError, 'unknown user sort', { by: by });
      }
    });
    return this.netService.get<NetPaginated<NetEntry>>('/users', nParams).pipe(
      map((res: NetPaginated<NetEntry>): Paginated<User> => {
        return paginatedFromNet(res, (nEntry: NetEntry): User => ({
          id: nEntry.id,
          username: nEntry.username,
          firstName: nEntry.first_name,
          lastName: nEntry.last_name,
          isAdmin: nEntry.is_admin,
          isActive: nEntry.is_active,
        }));
      }),
    );
  }

  /**
   * Searches for users using the given params.
   * @param params The search params.
   * @param includeInactive Whether to include inactive users.
   */
  searchUsers(params: SearchParams, includeInactive: boolean): Observable<SearchResult<User>> {
    interface NetEntry {
      id: string;
      username: string;
      first_name: string;
      last_name: string;
      is_admin: boolean;
      is_active: boolean;
    }

    const netParams = {
      ...netSearchParams(params),
      include_inactive: includeInactive,
    };
    return this.netService.get<NetSearchResult<NetEntry>>(urlJoin('/users', 'search'), netParams).pipe(
      map((res: NetSearchResult<NetEntry>): SearchResult<User> => {
        return searchResultFromNet(res, ((nEntry: NetEntry): User => ({
          id: nEntry.id,
          username: nEntry.username,
          firstName: nEntry.first_name,
          lastName: nEntry.last_name,
          isAdmin: nEntry.is_admin,
          isActive: nEntry.is_active,
        })));
      }),
    );
  }
}
