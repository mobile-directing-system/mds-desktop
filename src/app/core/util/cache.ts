import { Observable, of, Subject, Subscription, take } from 'rxjs';
import { MDSError, MDSErrorCode } from './errors';
import * as moment from 'moment';

/**
 * Cache for storing and retrieving data.
 */
export interface Cache<T> {
  /**
   * Retrieves the value with the given key. If no value was stored for this key, `undefined` is returned.
   * @param key The key of the value to retrieve.
   */
  get(key: string): T | undefined;

  /**
   * Clears the value for the given key. If no value was set for this key, nothing happens.
   * @param key The key for the value to clear.
   */
  clear(key: string): void;

  /**
   * Clears all values.
   */
  clearAll(): void;

  /**
   * Clears all values with last-access timestamp being older than the given duration. Returns the list of cleared
   * keys.
   * @param minAge The minimum age to clear.
   */
  clearAllOlderThan(minAge: moment.Duration): string[];

  /**
   * Sets the value for the given key. If a value already exists for this key, it is being overwritten.
   * @param key The key of the value to set.
   * @param value The value to set.
   */
  set(key: string, value: T): void;
}

interface CacheEntry<T> {
  lastAccessed: Date;
  value: T;
}

/**
 * Temporary {@link Cache}. Provides no persistence.
 */
export class InMemoryCache<T> implements Cache<T> {
  private store: { [keys: string]: CacheEntry<T> } = {};

  clear(key: string): void {
    delete this.store[key];
  }

  clearAll(): void {
    this.store = {};
  }

  clearAllOlderThan(minAge: moment.Duration): string[] {
    const cleared: string[] = [];
    for (let key in this.store) {
      if (this.store[key].lastAccessed.getTime() < moment().subtract(minAge).toDate().getTime()) {
        delete this.store[key];
        cleared.push(key);
      }
    }
    return cleared;
  }

  get(key: string): T | undefined {
    if (!this.store.hasOwnProperty(key)) {
      return undefined;
    }
    this.store[key].lastAccessed = new Date();
    return this.store[key].value;
  }

  set(key: string, value: T): void {
    this.store[key] = {
      lastAccessed: new Date(),
      value: value,
    };
  }
}

/**
 * Cache that returns a cached value or retrieves it using the provided retrieval-function.
 */
export class CachedRetriever<T> {
  /**
   * Subjects that allows multiple callers to subscribe to the same retrieval. When a value is retrieved using
   * {@link retrieve}, the corresponding subject emits.
   * @private
   */
  private ongoingRetrievalFinishers: { [key: string]: Subject<T> } = {};
  /**
   * Subscriptions for ongoing retrievals. This allows cancelling ongoing retrievals using {@link invalidate}.
   * @private
   */
  private ongoingRetrievals: { [key: string]: Subscription } = {};

  constructor(private cache: Cache<T>, private retrieveFn: (key: string) => Observable<T>) {
  }

  /**
   * Emits the cached value for the given key. If not found, the value is retrieved and emitted after retrieval has
   * finished. Only emits one value!
   * @param key The key of the value to retrieve.
   */
  get(key: string): Observable<T> {
    const v = this.cache.get(key);
    if (v !== undefined) {
      // Found in cache.
      return of(v);
    }
    // Retrieval needed. Check if retrieval already ongoing.
    const ongoingRetrievalFinisher = this.ongoingRetrievalFinishers[key];
    if (ongoingRetrievalFinisher) {
      return ongoingRetrievalFinisher.asObservable();
    }
    // No ongoing retrieval -> retrieve.
    if (this.ongoingRetrievals[key]) {
      throw new MDSError(MDSErrorCode.AppError, 'ongoing retrieval subject found, although no value or finisher available');
    }
    return this.retrieve(key);
  }

  /**
   * Begins retrieval for the value with the given key using {@link retrieveFn}.
   * @param key The key of the value to retrieve.
   * @private
   */
  private retrieve(key: string): Observable<T> {
    if (!this.ongoingRetrievals.hasOwnProperty(key)) {
      this.ongoingRetrievalFinishers[key] = new Subject<T>();
    }
    this.ongoingRetrievals[key]?.unsubscribe();
    this.ongoingRetrievals[key] = this.retrieveFn(key).pipe(take(1))
      .subscribe(retrievedValue => {
        this.cache.set(key, retrievedValue);
        this.ongoingRetrievalFinishers[key].next(retrievedValue);
        this.ongoingRetrievalFinishers[key].complete();
        delete this.ongoingRetrievalFinishers[key];
        delete this.ongoingRetrievals[key];
      });
    return this.ongoingRetrievalFinishers[key].asObservable();
  }

  /**
   * Invalidates the value and retrieves it again, if there were active retrievals.
   * @param key The key to invalidate the value for.
   */
  invalidate(key: string): void {
    this.cache.clear(key);
    if (this.ongoingRetrievals[key] || this.ongoingRetrievalFinishers[key]) {
      // Re-retrieve.
      this.retrieve(key);
    }
  }

  /**
   * Invalidates all values with last-access timestamp being older than the given duration.
   * @param minAge The minimum age to invalidate.
   */
  invalidateAllOlderThan(minAge: moment.Duration): void {
    const cleared = this.cache.clearAllOlderThan(minAge);
    cleared.forEach(key => this.invalidate(key));
  }
}
