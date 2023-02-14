import { Injectable } from '@angular/core';
import {
  AnalogRadioMessageIntel,
  CreateIntel,
  Intel,
  IntelBase,
  IntelType,
  PlaintextMessageIntel,
} from '../model/intel';
import { NetService } from './net.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MDSError, MDSErrorCode } from '../util/errors';
import urlJoin from 'url-join';
import { Paginated, PaginationParams } from '../util/store';
import { NetPaginated, netPaginationParams, NetPaginationParams, paginatedFromNet } from '../util/net';

/**
 * Used to filter {@link Intel}.
 */
export interface IntelFilter {
  /**
   * Filters {@link Intel} to be created by the user with the given id.
   */
  createdBy?: string,

  /**
   * Filters {@link Intel} to be associated with the given operation.
   */
  operation?: string,

  /**
   * Filters {@link Intel} to be of the given {@link IntelType}
   */
  intelType?: IntelType,

  /**
   * Filters {@link Intel} to have a higher importance than the given value.
   */
  minImportance?: number,

  /**
   * Filters {@link Intel} to not include invalidated {@link Intel}
   */
  includeInvalid?: false,

  /**
   * Filters {@link Intel} to only include intel with deliveries for the address book entries with the given ids.
   */
  oneOfDeliveryForEntries?: string[]

  /**
   * Filters {@link Intel} to only include intel with successful deliveries for the address book entries with the given
   * ids.
   */
  oneOfDeliveredToEntries?: string[],
}

/**
 * Net representation of {@link Intel}.
 */
export type NetIntel = NetPlaintextMessageIntel | NetAnalogRadioMessageIntel

/**
 * Net Representation of {@link IntelBase}.
 */
interface NetIntelBase {
  id: string,
  created_at: Date,
  created_by: string,
  operation: string,
  type: string,
  content: object,
  search_text: string,
  importance: number,
  is_valid: boolean,
}

/**
 * Net representation of {@link PlaintextMessageIntel}.
 */
interface NetPlaintextMessageIntel extends NetIntelBase {
  type: 'plaintext-message',
  content: {
    text: string,
  }
}

/**
 * Net representation of {@link AnalogRadioMessageIntel}.
 */
interface NetAnalogRadioMessageIntel extends NetIntelBase {
  type: 'analog-radio-message',
  content: {
    channel: string,
    callsign: string,
    head: string,
    content: string,
  }
}

/**
 * Maps {@link NetIntel} to {@link IntelType}.
 * @param n The intel to map.
 */
function appIntelTypeFromNet(n: NetIntel): IntelType {
  switch (n.type) {
    case 'analog-radio-message':
      return IntelType.AnalogRadioMessage;
    case 'plaintext-message':
      return IntelType.PlainTextMessage;
    default:
      throw new MDSError(MDSErrorCode.AppError, `unsupported intel type while converting to app representation: ${ (n as Intel).type }`);
  }
}

/**
 * Maps {@link NetIntel} to {@link IntelBase}.
 * @param n The intel to map.
 */
function appIntelBaseFromNet(n: NetIntel): IntelBase {
  return {
    id: n.id,
    createdAt: n.created_at,
    createdBy: n.created_by,
    operation: n.operation,
    type: appIntelTypeFromNet(n),
    content: {},
    searchText: n.search_text,
    importance: n.importance,
    isValid: n.is_valid,
  };
}

/**
 * Maps {@link NetAnalogRadioMessageIntel} to {@link AnalogRadioMessageIntel}.
 * @param n The intel to map.
 */
function appAnalogRadioMessageIntelFromNet(n: NetAnalogRadioMessageIntel): AnalogRadioMessageIntel {
  return {
    ...appIntelBaseFromNet(n),
    type: IntelType.AnalogRadioMessage,
    content: {
      channel: n.content.channel,
      callsign: n.content.callsign,
      head: n.content.head,
      content: n.content.content,
    },
  };
}

/**
 * Maps {@link NetPlaintextMessageIntel} to {@link PlaintextMessageIntel}.
 * @param n The intel to map.
 */
function appPlaintextMessageIntelFromNet(n: NetPlaintextMessageIntel): PlaintextMessageIntel {
  return {
    ...appIntelBaseFromNet(n),
    type: IntelType.PlainTextMessage,
    content: {
      text: n.content.text,
    },
  };
}

/**
 * Maps {@link NetIntel} to {@link Intel}.
 * @param n The intel to map.
 */
function appIntelFromNet(n: NetIntel): Intel {
  switch (n.type) {
    case 'analog-radio-message':
      return appAnalogRadioMessageIntelFromNet(n);
    case 'plaintext-message':
      return appPlaintextMessageIntelFromNet(n);
    default:
      throw new MDSError(MDSErrorCode.AppError, `unsupported intel type while converting to app representation: ${ (n as Intel).type }`);
  }
}

@Injectable({
  providedIn: 'root',
})

/**
 * Service for intel management. Allows creation, manipulation and retrieval of intel.
 */
export class IntelService {

  constructor(private netService: NetService) {
  }

  /**
   * Creates new intel and returns the created one.
   * @param create The intel to create.
   */
  createIntel(create: CreateIntel): Observable<Intel> {
    interface NetCreate {
      operation: string;
      type: string;
      content: object;
      importance: number;
      initial_deliver_to: string[];
    }

    const body: NetCreate = {
      operation: create.operation,
      type: create.type,
      content: create.content,
      importance: create.importance,
      initial_deliver_to: create.initialDeliverTo,
    };

    return this.netService.postJSON<NetIntel>('/intel', body, {}).pipe(
      map((res: NetIntel): Intel => appIntelFromNet(res)),
    );
  }

  /**
   * Invalidates the given intel.
   * @param intelId The id of the intel to invalidate.
   */
  invalidateIntel(intelId: string): Observable<void> {
    return this.netService.postJSON(urlJoin('/intel', intelId, 'invalidate'), {}, {});
  }

  /**
   * Retrieves the intel with the given id.
   * @param intelId The id of the intel to be retrieved.
   */
  getIntelById(intelId: string): Observable<Intel> {
    return this.netService.get<NetIntel>(urlJoin('/intel', intelId), {}).pipe(
      map((res: NetIntel): Intel => appIntelFromNet(res)),
    );
  }

  /**
   * Retrieves paginated {@link Intel} list.
   * @param params Params for pagination.
   * @param filters Filters for retrieval.
   */
  getIntel(params: PaginationParams<any>, filters: IntelFilter): Observable<Paginated<Intel>> {
    interface NetParams extends NetPaginationParams {
      created_by?: string,
      operation?: string,
      intel_type?: string,
      min_importance?: number,
      include_invalid?: boolean,
      one_of_delivery_for_entries?: string[],
      one_of_delivered_to_entries?: string[],
    }

    const nParams: NetParams = {
      ...netPaginationParams(params, () => undefined),
      created_by: filters.createdBy,
      operation: filters.operation,
      intel_type: filters.intelType,
      min_importance: filters.minImportance,
      include_invalid: filters.includeInvalid,
      one_of_delivery_for_entries: filters.oneOfDeliveryForEntries,
      one_of_delivered_to_entries: filters.oneOfDeliveredToEntries,
    };

    return this.netService.get<NetPaginated<NetIntel>>('/intel', nParams).pipe(
      map((res: NetPaginated<NetIntel>): Paginated<Intel> => {
        return paginatedFromNet(res, (nEntry: NetIntel): Intel => appIntelFromNet(nEntry));
      }),
    );
  }
}
