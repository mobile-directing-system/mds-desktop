import { Injectable } from '@angular/core';
import { NetService } from './net.service';
import { AddressBookEntry, CreateAddressBookEntry } from '../model/address-book-entry';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import urlJoin from 'url-join';
import { map } from 'rxjs/operators';
import { Paginated, PaginationParams, SearchParams, SearchResult } from '../util/store';
import {
  NetPaginated,
  NetPaginationParams,
  netPaginationParams,
  netSearchParams,
  NetSearchResult,
  paginatedFromNet,
  searchResultFromNet,
} from '../util/net';
import { MDSError, MDSErrorCode } from '../util/errors';

/**
 * Fields for sorting address book entries.
 */
export enum AddressBookEntrySort {
  ByLabel,
  ByDescription,
}

/**
 * Filters for address book entry retrieval.
 */
export interface AddressBookEntryFilters {
  byUser?: string,
  forOperation?: string,
  excludeGlobal?: boolean,
  visibleBy?: string,
  includeForInActiveUsers?: boolean,
  autoDeliveryEnabled?: boolean,
}

interface NetUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  is_active: boolean;
}

/**
 * Maps {@link NetUser} to {@link User}.
 * @param net The user to map.
 */
function userFromNet(net: NetUser): User {
  return {
    id: net.id,
    username: net.username,
    firstName: net.first_name,
    lastName: net.last_name,
    isAdmin: net.is_admin,
    isActive: net.is_active,
  };
}

/**
 * Service for address book entry management. Allows creation, manipulation and retrieval of address book entries.
 */
@Injectable({
  providedIn: 'root',
})
export class AddressBookService {

  constructor(private netService: NetService) {
  }

  /**
   * Creates the given address book entry and returns the created one.
   * @param create The details for address book entry creation.
   */
  createAddressBookEntry(create: CreateAddressBookEntry): Observable<AddressBookEntry> {
    interface NetCreate {
      label: string;
      description: string;
      operation?: string;
      user?: string;
    }

    interface NetCreated {
      id: string;
      label: string;
      description: string;
      operation?: string;
      user?: string;
      user_details?: NetUser;
    }

    const body: NetCreate = {
      label: create.label,
      description: create.description,
      operation: create.operation,
      user: create.user,
    };

    return this.netService.postJSON<NetCreated>(urlJoin('/address-book', 'entries'), body, {}).pipe(
      map((res: NetCreated): AddressBookEntry => ({
        id: res.id,
        label: res.label,
        description: res.description,
        operation: res.operation,
        user: res.user,
        userDetails: res.user_details ? userFromNet(res.user_details) : undefined,
      })),
    );
  }

  /**
   * Updates the given address book entry, identified by its {@link AddressBookEntry.id}.
   * @param update The updated address book entry.
   */
  updateAddressBookEntry(update: AddressBookEntry): Observable<void> {
    interface NetUpdate {
      id: string;
      label: string;
      description: string;
      operation?: string;
      user?: string;
    }

    const body: NetUpdate = {
      id: update.id,
      label: update.label,
      description: update.description,
      operation: update.operation,
      user: update.user,
    };

    return this.netService.putJSON(urlJoin('/address-book', 'entries', update.id), body, {});
  }

  /**
   * Deletes the address book entry associated with the given id.
   * @param addressBookEntryId The ud of the address book entry to be deleted.
   */
  deleteAddressBookEntry(addressBookEntryId: string): Observable<void> {
    return this.netService.delete(urlJoin('/address-book', 'entries', addressBookEntryId), {});
  }

  /**
   * Retrieves the address book entry with the given id.
   * @param addressBookEntryId The id of the address book entry to retrieve.
   */
  getAddressBookEntryById(addressBookEntryId: string): Observable<AddressBookEntry> {
    interface NetAddressBookEntry {
      id: string;
      label: string;
      description: string;
      operation?: string;
      user?: string;
      user_details?: NetUser;
    }

    return this.netService.get<NetAddressBookEntry>(urlJoin('/address-book', 'entries', addressBookEntryId), {}).pipe(
      map((res: NetAddressBookEntry): AddressBookEntry => ({
        id: res.id,
        label: res.label,
        description: res.description,
        operation: res.operation,
        user: res.user,
        userDetails: res.user_details ? userFromNet(res.user_details) : undefined,
      })),
    );
  }

  /**
   * Retrieves a paginated list of entries with the given params.
   * @param params Pagination params.
   * @param filters Filters for retrieval.
   */
  getAddressBookEntries(params: PaginationParams<AddressBookEntrySort>, filters: AddressBookEntryFilters): Observable<Paginated<AddressBookEntry>> {
    interface NetEntry {
      id: string;
      label: string;
      description: string;
      operation?: string;
      user?: string;
      user_details?: NetUser;
    }

    interface NetParams extends NetPaginationParams {
      by_user?: string,
      for_operation?: string,
      exclude_global?: boolean,
      visible_by?: string,
      include_for_inactive_users?: boolean,
      auto_delivery_enabled?: boolean;
    }

    const nParams: NetParams = netPaginationParams(params, (by: AddressBookEntrySort) => {
      switch (by) {
        case AddressBookEntrySort.ByDescription:
          return 'description';
        case AddressBookEntrySort.ByLabel:
          return 'label';
        default:
          throw new MDSError(MDSErrorCode.AppError, 'unknown address book sort', { by: by });
      }
    });
    nParams.by_user = filters.byUser;
    nParams.visible_by = filters.visibleBy;
    nParams.include_for_inactive_users = filters.includeForInActiveUsers;
    nParams.exclude_global = filters.excludeGlobal;
    nParams.for_operation = filters.forOperation;
    nParams.auto_delivery_enabled = filters.autoDeliveryEnabled;

    return this.netService.get<NetPaginated<NetEntry>>(urlJoin('/address-book', 'entries'), nParams).pipe(
      map((res: NetPaginated<NetEntry>): Paginated<AddressBookEntry> => {
        return paginatedFromNet(res, (nEntry: NetEntry): AddressBookEntry => ({
          id: nEntry.id,
          label: nEntry.label,
          description: nEntry.description,
          operation: nEntry.operation,
          user: nEntry.user,
          userDetails: nEntry.user_details ? userFromNet(nEntry.user_details) : undefined,
        }));
      }),
    );
  }

  /**
   * Searches address book entries using the given parameters.
   * @param params The search parameters.
   * @param filters Filters for retrieval.
   */
  searchAddressBookEntries(params: SearchParams, filters: AddressBookEntryFilters): Observable<SearchResult<AddressBookEntry>> {
    interface NetEntry {
      id: string;
      label: string;
      description: string;
      operation?: string;
      user?: string;
      user_details?: NetUser;
    }

    interface NetParams extends NetPaginationParams {
      by_user?: string,
      for_operation?: string,
      exclude_global?: boolean,
      visible_by?: string,
      include_for_inactive_users?: boolean,
    }

    const netParams: NetParams = {
      ...netSearchParams(params),
      by_user: filters.byUser,
      for_operation: filters.forOperation,
      exclude_global: filters.excludeGlobal,
      visible_by: filters.visibleBy,
      include_for_inactive_users: filters.includeForInActiveUsers,
    };

    return this.netService.get<NetSearchResult<NetEntry>>(urlJoin('/address-book', 'entries', 'search'), netParams).pipe(
      map((res: NetSearchResult<NetEntry>): SearchResult<AddressBookEntry> => {
        return searchResultFromNet(res, (nEntry: NetEntry): AddressBookEntry => ({
          id: nEntry.id,
          label: nEntry.label,
          description: nEntry.description,
          operation: nEntry.operation,
          user: nEntry.user,
          userDetails: nEntry.user_details ? userFromNet(nEntry.user_details) : undefined,
        }));
      }),
    );
  }

  /**
   * Checks whether auto intel delivery is enabled for the address book entry with the given id.
   * @param entryId The id of the address book entry to check.
   */
  isAutoIntelDeliveryEnabledForAddressBookEntry(entryId: string): Observable<boolean> {
    return this.netService.getText(urlJoin('/address-book', 'entries', entryId, 'auto-intel-delivery'), {})
      .pipe(map(res => res === 'true'));
  }

  /**
   * Enables auto intel delivery for the address book entry with the given id.
   * @param entryId The id of the address book entry to enable auto intel delivery for.
   */
  enableAutoIntelDeliveryForAddressBookEntry(entryId: string): Observable<void> {
    return this.netService.post<void>(urlJoin('/address-book', 'entries', entryId, 'auto-intel-delivery', 'enable'), {});
  }

  /**
   * Disabled auto intel delivery for the address book entry with the given id.
   * @param entryId The id of the address book entry to disable auto intel delivery for.
   */
  disableAutoIntelDeliveryForAddressBookEntry(entryId: string): Observable<void> {
    return this.netService.post<void>(urlJoin('/address-book', 'entries', entryId, 'auto-intel-delivery', 'disable'), {});
  }
}
