import {Injectable} from '@angular/core';
import {NetService} from './net.service';
import {CreateOperation, Operation} from "../model/operation";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Paginated, PaginationParams, SearchParams, SearchResult} from '../util/store';
import {
  NetPaginated,
  netPaginationParams,
  netSearchParams,
  NetSearchResult,
  paginatedFromNet,
  searchResultFromNet,
} from '../util/net';
import {MDSError, MDSErrorCode} from '../util/errors';
import urlJoin from 'url-join';
import {User} from "../model/user";

/**
 * Fields for sorting operations.
 */
export enum OperationSort {
  ByTitle,
  ByDescription,
  ByStart,
  ByEnd,
  ByIsArchived
}

/**
 * Fields for sorting members of an operation.
 */
export enum MemberSort {
  ByUsername,
  ByFirstName,
  ByLastName
}

/**
 * Service for operation management, manipulation and retrieval of  operations.
 */
@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private netService: NetService) {
  }

  /**
   * Creates the given operation and returns the newly created one.
   * @param create The operation to be created.
   */
  createOperation(create: CreateOperation): Observable<Operation> {
    interface NetCreate {
      title: string;
      description: string;
      start: Date;
      end?: Date;
      is_archived:boolean;
    }

    interface NetCreated {
      id: string,
      title: string;
      description: string;
      start: Date;
      end?: Date;
      is_archived:boolean;
    }

    const body: NetCreate = {
      title: create.title,
      description: create.description,
      start: create.start,
      end: create.end,
      is_archived:create.is_archived,
    };
    return this.netService.postJSON<NetCreated>('/operations', body, {}).pipe(
      map((res: NetCreated): Operation => ({
        id: res.id,
        title: res.title,
        description: res.description,
        start: res.start,
        end: res.end,
        is_archived:res.is_archived,
      }))
    );
  }

  /**
   * Updates the given operation, identified by its {@link Operation.id}.
   * @param update The updated operation.
   */
  updateOperation(update: Operation): Observable<void> {
    interface NetUpdate {
      id: string,
      title: string;
      description: string;
      start: Date;
      end?: Date;
      is_archived:boolean;
    }

    const body: NetUpdate = {
      id: update.id,
      title: update.title,
      description: update.description,
      start: update.start,
      end: update.end,
      is_archived:update.is_archived,
    };
    return this.netService.putJSON(urlJoin('/operations', update.id), body, {});
  }

  /**
   * Retrieves the operation with the given id.
   * @param operationId
   */
  getOperationById(operationId: string): Observable<Operation> {
    interface NetOperation {
      id: string,
      title: string;
      description: string;
      start: Date;
      end?: Date;
      is_archived:boolean;
    }

    return this.netService.get<NetOperation>(urlJoin('/operations', operationId),{}).pipe(
      map((res: NetOperation): Operation => ({
        id: res.id,
        title: res.title,
        description: res.description,
        start: res.start,
        end: res.end,
        is_archived:res.is_archived,
      })),
    );
  }

  /**
   * Retrieves a paginated operation list sorted by the given params.
   * @param params The pagination parameters.
   */
  getOperations(params: PaginationParams<OperationSort>): Observable<Paginated<Operation>> {
    interface NetEntry {
      id: string,
      title: string;
      description: string;
      start: Date;
      end?: Date;
      is_archived:boolean;
    }

    const nParams = netPaginationParams(params, (by: OperationSort) => {
      switch (by) {
        case OperationSort.ByTitle:
          return 'title';
        case OperationSort.ByDescription:
          return 'description';
        case OperationSort.ByStart:
          return 'start';
        case OperationSort.ByEnd:
          return 'end';
        case OperationSort.ByIsArchived:
          return 'is_archived';
        default:
          throw new MDSError(MDSErrorCode.AppError, 'unknown operation sort', {by: by});
      }
    });
    return this.netService.get<NetPaginated<NetEntry>>('/operations', nParams).pipe(
      map( (res: NetPaginated<NetEntry>): Paginated<Operation> => {
        return  paginatedFromNet(res, (nEntry: NetEntry): Operation => ({
          id: nEntry.id,
          title: nEntry.title,
          description: nEntry.description,
          start: nEntry.start,
          end: nEntry.end,
          is_archived:nEntry.is_archived,
        }));
      }),
    );
  }

  /**
   * Searches operations using the given parameters.
   * @param params The search parameters.
   */
  searchOperations(params: SearchParams): Observable<SearchResult<Operation>> {
    interface NetEntry {
      id: string,
      title: string;
      description: string;
      start: Date;
      end?: Date;
      is_archived:boolean;
    }

    const netParams = {
      ...netSearchParams(params)
    };
    return this.netService.get<NetSearchResult<NetEntry>>(urlJoin('/operations', 'search'), netParams).pipe(
      map((res: NetSearchResult<NetEntry>): SearchResult<Operation> => {
        return  searchResultFromNet(res, (nEntry: NetEntry): Operation => ({
          id: nEntry.id,
          title: nEntry.title,
          description: nEntry.description,
          start: nEntry.start,
          end: nEntry.end,
          is_archived:nEntry.is_archived,
        }));
      }),
    )
  }

  /**
   * Updates the members associated with the operation identified by the given {@link operationId}.
   * @param operationId Id of the Operation.
   * @param memberIds Ids of the new members.
   */
  updateOperationMembers(operationId: string, memberIds :string[]): Observable<void> {
    return this.netService.putJSON(urlJoin('/operations', operationId, 'members'), memberIds, {});
  }

  /**
   * Returns a paginated list of users with the given params, that are member of the given operation.
   * @param operationId Id of the operation.
   * @param params Params for pagination.
   */
  getOperationMembers(operationId: string, params: PaginationParams<MemberSort>): Observable<Paginated<User>> {
    interface NetEntry {
      id: string;
      username: string;
      first_name: string;
      last_name: string;
      is_admin: boolean;
      is_active: boolean;
    }

    const nParams = netPaginationParams(params, (by: MemberSort) => {
      switch (by) {
        case MemberSort.ByUsername:
          return 'username';
        case MemberSort.ByFirstName:
          return 'first_name';
        case MemberSort.ByLastName:
          return 'last_name';
        default:
          throw new MDSError(MDSErrorCode.AppError, 'unknown member sort', {by: by});
      }
    });
    return this.netService.get<NetPaginated<NetEntry>>(urlJoin('/operations', operationId, 'members'), nParams).pipe(
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
}
