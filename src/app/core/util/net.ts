import { HttpErrorResponse } from '@angular/common/http';
import { StatusCodes } from 'http-status-codes';
import { MDSErrorCode } from './errors';
import {
  OrderDir,
  Paginated,
  SearchParams,
  SearchResult,
  PaginationParams,
  StoreRequestError,
  StoreRequestMethod,
} from './store';

/**
 * Creates a {@link StoreRequestError} from an {@link HttpErrorResponse}.
 *
 * @param error The http error response.
 * @param method The used request method.
 * @param message Optional error message overwrite.
 */
export function createStoreRequestErrorFromHttp(error: HttpErrorResponse, method: StoreRequestMethod, message?: string): StoreRequestError {
  return new StoreRequestError(getStoreRequestErrorTypeFromHttp(error.status), method, error, {}, message);
}

/**
 * Converts the given http status code to an {@link MDSErrorCode}.
 *
 * @param status The http status code from {@link HttpErrorResponse}.
 */
function getStoreRequestErrorTypeFromHttp(status: number): MDSErrorCode {
  switch (status) {
    case StatusCodes.NOT_FOUND:
      return MDSErrorCode.NotFound;
    case StatusCodes.UNAUTHORIZED:
      return MDSErrorCode.Unauthorized;
    case StatusCodes.FORBIDDEN:
      return MDSErrorCode.Forbidden;
    case StatusCodes.BAD_REQUEST:
      return MDSErrorCode.BadInput;
    case StatusCodes.INTERNAL_SERVER_ERROR:
      return MDSErrorCode.ServerError;
    default:
      return MDSErrorCode.Unexpected;
  }
}

/**
 * Net representation of {@link PaginationParams}.
 */
export interface NetPaginationParams {
  limit: number;
  offset: number;
  order_by?: string;
  order_dir?: NetOrderDir;
}

/**
 * Net representation of {@link SearchParams}.
 */
export interface NetSearchParams {
  q: string;
  limit: number;
  offset: number;
}

/**
 * Renames keys in an object based on the keys map. Keys map consists of keys for the keys to be replaced and the value
 * for the new key name.
 *
 * Taken from
 * {@link https://www.freecodecamp.org/news/30-seconds-of-code-rename-many-object-keys-in-javascript-268f279c7bfa/}.
 *
 * @param keysMap The keys map.
 * @param obj The object to be altered.
 */
export function renameKeys(keysMap: { [keys: string]: string }, obj: { [keys: string]: any }): {} {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {},
  );
}

/**
 * Removes `null` and `undefined` fields from an object.
 *
 * Taken from
 * {@link https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript?page=1&tab=votes#tab-top}.
 *
 * @param obj The object to remove the fields from.
 */
export function clean(obj: { [key: string]: any }): any {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}

/**
 * Net representation of {@link OrderDir}.
 */
export enum NetOrderDir {
  Asc = 'asc',
  Desc = 'desc'
}

/**
 * Net representation of {@link Paginated}.
 */
export interface NetPaginated<T> {
  total: number;
  limit: number;
  offset: number;
  ordered_by?: string;
  order_dir?: NetOrderDir;
  retrieved: number;
  entries: T[];
}

/**
 * Net representation of {@link SearchResult}.
 */
export interface NetSearchResult<T> {
  hits: T[];
  estimatedTotalHits: number;
  offset: number;
  limit: number;
  processingTime: number;
  query: string;
}

/**
 * Converts a {@link NetPaginated} with net entries to a {@link Paginated} with all entries mapped via the given
 * mapping function.
 *
 * @param netPaginated The net list.
 * @param mappingFn The mapping function for mapping the result.
 */
export function paginatedFromNet<N, S>(netPaginated: NetPaginated<N>, mappingFn: (from: N) => S): Paginated<S> {
  const list: Paginated<N> = new Paginated<N>(netPaginated.entries, {
    limit: netPaginated.limit,
    offset: netPaginated.offset,
    orderDir: netPaginated.order_dir == NetOrderDir.Asc ? OrderDir.Asc : OrderDir.Desc,
    orderedBy: netPaginated.ordered_by,
    retrieved: netPaginated.retrieved,
    total: netPaginated.total,
  });
  return list.changeResultType(list.entries.map(mappingFn));
}

/**
 * Maps {@link PaginationParams} to {@link NetPaginationParams}.
 * @param sParams The params to map.
 * @param mapOrderBy The mapping function for the {@link PaginationParams.orderBy} field.
 */
export function netPaginationParams<T>(sParams: PaginationParams<T>, mapOrderBy: (from: T) => string | undefined): NetPaginationParams {
  let netOrderDir: NetOrderDir | undefined;
  switch (sParams.orderDir) {
    case OrderDir.Asc:
      netOrderDir = NetOrderDir.Asc;
      break;
    case OrderDir.Desc:
      netOrderDir = NetOrderDir.Desc;
      break;
    default:
      netOrderDir = undefined;
      break;
  }
  return {
    limit: sParams.limit,
    offset: sParams.offset,
    order_by: sParams.orderBy !== undefined ? mapOrderBy(sParams.orderBy) : undefined,
    order_dir: netOrderDir,
  };
}

/**
 * Maps {@link SearchParams} to {@link NetSearchParams}.
 * @param sParams The params to map.
 */
export function netSearchParams(sParams: SearchParams): NetSearchParams {
  return {
    q: sParams.query,
    limit: sParams.limit,
    offset: sParams.offset,
  };
}

/**
 * Converts a {@link NetSearchResult} with net entries to a {@link SearchResult} with all entries mapped via the given
 * mapping function.
 * @param netResult The net result.
 * @param mappingFn The mapping function for mapping the result.
 */
export function searchResultFromNet<N, T>(netResult: NetSearchResult<N>, mappingFn: (from: N) => T): SearchResult<T> {
  const list: SearchResult<N> = new SearchResult<N>(netResult.hits, {
    estimatedTotalHits: netResult.estimatedTotalHits,
    limit: netResult.limit,
    offset: netResult.offset,
    processingTime: netResult.processingTime,
    query: netResult.query,
  });
  return list.changeResultType(list.hits.map(mappingFn));
}
