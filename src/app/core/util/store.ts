import { MDSError, MDSErrorCode } from './errors';
import { HttpErrorResponse } from '@angular/common/http';

export enum OrderDir {
  Asc = 'asc',
  Desc = 'desc',
}

export class StoreRequestError extends MDSError {
  /**
   * The method that was being executed.
   */
  method: StoreRequestMethod;
  /**
   * The original {@link HttpErrorResponse}.
   */
  httpErrorResponse: HttpErrorResponse;

  constructor(code: MDSErrorCode, method: StoreRequestMethod, httpErrorResponse: HttpErrorResponse,
              details: object, message?: string) {
    super(code, message, details);
    this.code = code;
    this.method = method;
    this.httpErrorResponse = httpErrorResponse;
    this.details = details;
  }
}

export enum StoreRequestMethod {
  Delete = 'delete',
  Get = 'get',
  Post = 'post',
  Put = 'put'
}

export interface PaginationParams<T> {
  /**
   * The maximum amount of entries to be retrieved.
   */
  limit: number;
  /**
   * The offset. An offset of 0 means that the amount {@link limit} of entries is retrieved from the beginning. An
   * offset of 5 means that the amount {@link limit} of entries is retrieved starting from the 6th one.
   */
  offset: number;
  /**
   * The attribute to order by.
   */
  orderBy?: T;
  /**
   * The order direction.
   */
  orderDir?: OrderDir;
}

/**
 * Provides a generic container for entry retrieval as paginated list.
 */
export class Paginated<T> {
  /**
   * Total count of available entries.
   */
  total: number;
  /**
   * Applied limit to retrieved entries.
   */
  limit: number;
  /**
   * Applied offset to retrieved entries.
   */
  offset: number;
  /**
   * Field name the entries were ordered by.
   */
  orderedBy?: string;
  /**
   * Applied direction for ordering entries.
   */
  orderDir?: OrderDir;
  /**
   * The amount of retrieved entries in {@link entries}.
   */
  retrieved: number;
  /**
   * The actual entries.
   */
  entries: T[];

  /**
   * Creates a new list.
   *
   * @param entries The result as an array.
   * @param details Further details.
   */
  constructor(entries: T[], details: {
    total: number;
    limit: number;
    offset: number;
    orderedBy?: string;
    orderDir?: OrderDir;
    retrieved: number;
  }) {
    this.entries = entries;
    this.total = details.total;
    this.limit = details.limit;
    this.offset = details.offset;
    this.orderedBy = details.orderedBy;
    this.orderDir = details.orderDir;
    this.retrieved = details?.retrieved ?? entries.length;
  }

  /**
   * Creates a new list from the current one with a new result type. This means that this method provides type
   * conversion.
   *
   * @param result The new result to use.
   */
  changeResultType<N>(result: N[]): Paginated<N> {
    return new Paginated<N>(result, {
      limit: this.limit,
      offset: this.offset,
      orderDir: this.orderDir,
      orderedBy: this.orderedBy,
      retrieved: this.retrieved,
      total: this.total,
    });
  }
}

export interface SearchParams {
  /**
   * The search query.
   */
  query: string;
  /**
   * The maximum amount of entries to be retrieved.
   */
  limit: number;
  /**
   * The offset. An offset of 0 means that the amount {@link limit} of entries is retrieved from the beginning. An
   * offset of 5 means that the amount {@link limit} of entries is retrieved starting from the 6th one.
   */
  offset: number;
}

/**
 * Provides a generic container for entry retrieval via search.
 */
export class SearchResult<T> {
  /**
   * The ordered list search hits.
   */
  hits: T[];
  /**
   * Total hits are not computed because of performance reasons. This is an estimation only.
   */
  estimatedTotalHits: number;
  /**
   * Applied offset for retrieved entries.
   */
  offset: number;
  /**
   * Applied limit for retrieved entries.
   */
  limit: number;
  /**
   * Duration of searching in nanoseconds.
   */
  processingTime: number;
  /**
   * The original search query.
   */
  query: string;

  /**
   * Creates a new result.
   *
   * @param hits The result as an ordered array.
   * @param details Further details.
   */
  constructor(hits: T[], details: {
    estimatedTotalHits: number;
    offset: number;
    limit: number;
    processingTime: number;
    query: string;
  }) {
    this.hits = hits;
    this.estimatedTotalHits = details.estimatedTotalHits;
    this.offset = details.offset;
    this.limit = details.limit;
    this.processingTime = details.processingTime;
    this.query = details.query;
  }

  /**
   * Creates a new search result from the current one with a new result type. This means that this method provides type
   * conversion.
   *
   * @param result The new result to use.
   */
  changeResultType<N>(result: N[]): SearchResult<N> {
    return new SearchResult<N>(result, {
      estimatedTotalHits: this.estimatedTotalHits,
      limit: this.limit,
      offset: this.offset,
      processingTime: this.processingTime,
      query: this.query,
    });
  }
}

/**
 * Performs a string search on the given `list`. It takes a function that returns an array of names that will be
 * checked against the
 * `search` term. Names that start with the `search` term will have higher priority than the ones that "only" include
 * the term. All checking against the `search` term is case insensitive.
 *
 * @param search The search term.
 * @param list The list of entries.
 * @param names The function that maps entries to an array of names.
 */
export function performSearch<T>(search: string, list: T[], names: (entry: T) => string[]): T[] {
  const startsWithList: T[] = [];
  const includesList: T[] = [];
  search = search.toUpperCase();

  // Iterate over all entries.
  for (const entry of list) {
    // Remember what case applies to the entry in order to add it to the correct list after all names have been checked.
    let hasStartsWith = false;
    let hasInclude = false;
    const entryNames = names(entry).map(name => name.toUpperCase());
    // Iterate over names.
    for (const entryName of entryNames) {
      if (entryName.startsWith(search)) {
        hasStartsWith = true;
        // Starts with has highest priority --> done.
        break;
      } else if (entryName.includes(search)) {
        hasInclude = true;
      }
    }
    // Add it to the correct list.
    if (hasStartsWith) {
      startsWithList.push(entry);
    } else if (hasInclude) {
      includesList.push(entry);
    }
  }
  // Return the merged list.
  return startsWithList.concat(includesList);
}

/**
 * Performs sort for the given array. This is _not_ done in place. It takes the wanted sort, a list of items to create
 * a sorted list from and the sort functions. Make sure that the wanted sort function exists. If the mapping function
 * is unknown, an empty list will be returned.
 *
 * @param sortBy The sort property.
 * @param sortDir The sort direction.
 * @param list The list of entries to create a sorted list from.
 * @param mappingFns The sort functions to choose from.
 */
export function performSort<T>(sortBy: string, sortDir: OrderDir, list: T[],
                               mappingFns: { sort: string; mapFn: (item: T) => string | number | boolean }[]): T[] {
  // Check if search is wanted.
  if (!sortBy || sortBy === '') {
    return list.filter(() => true);
  }
  // Check if the mapping function exists.
  const mappingFn = mappingFns.find(e => e.sort === sortBy)?.mapFn;
  if (!mappingFn) {
    return [];
  }
  // Function exists --> create a copy.
  const copy = [...list];
  copy.sort((a, b) => {
    // Perform mapping.
    const aComparable = mappingFn(a);
    const bComparable = mappingFn(b);
    // Compare.
    if (aComparable > bComparable) {
      return 1;
    } else if (aComparable < bComparable) {
      return -1;
    }
    return 0;
  });
  // Reverse if sort direction is descending.
  if (sortDir === OrderDir.Desc) {
    copy.reverse();
  }
  return copy;
}

export const VARCHAR_64_LENGTH = 64;
export const VARCHAR_512_LENGTH = 512;
export const VARCHAR_4096_LENGTH = 4096;
