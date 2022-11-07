import { SearchParams, SearchResult } from '../util/store';
import { NetSearchResult } from '../util/net';

/**
 * Generates random {@link SearchParams}.
 */
export function testGenRandomSearchParams(): SearchParams {
  return {
    limit: Math.floor(Math.random() * 100),
    offset: Math.floor(Math.random() * 100),
    query: 'far',
  };
}

/**
 * Generates {@link NetSearchResult} from the given {@link SearchParams} and entries.
 * @param params The search params to generate from.
 * @param hits The actual hits which will be used to fill {@link NetSearchResult.hits} and
 *   {@link NetSearchResult.estimatedTotalHits}.
 */
export function testGenNetSearchResult<T>(params: SearchParams, hits: T[]): NetSearchResult<T> {
  return {
    estimatedTotalHits: hits.length * 8,
    hits: hits,
    limit: params.limit,
    offset: params.offset,
    processingTime: hits.length * 11,
    query: params.query,
  };
}

/**
 * Converts a {@link NetSearchResult} with net entries to a {@link SearchResult} with the given hits
 * @param nResult The net result.
 * @param hits The hits for the result.
 */
export function testGenSearchResultFromNet<T>(nResult: NetSearchResult<any>, hits: T[]): SearchResult<T> {
  return new SearchResult<T>(hits, {
    estimatedTotalHits: nResult.estimatedTotalHits,
    limit: nResult.limit,
    offset: nResult.offset,
    processingTime: nResult.processingTime,
    query: nResult.query,
  });
}
