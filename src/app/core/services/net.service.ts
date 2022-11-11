import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MDSError, MDSErrorCode } from '../util/errors';
import { clean, createStoreRequestErrorFromHttp } from '../util/net';
import { StoreRequestError, StoreRequestMethod } from '../util/store';

/**
 * Used as a wrapper for {@link HttpClient} in order to provide centralized error handling, resource access
 * information, etc.
 */
@Injectable({
  providedIn: 'root',
})
export class NetService {
  baseUrl?: string;
  requestHeaders: HttpHeaders = new (HttpHeaders);

  constructor(private http: HttpClient) {
  }

  private static handleError(error: HttpErrorResponse, method: StoreRequestMethod, message?: string): StoreRequestError {
    return createStoreRequestErrorFromHttp(error, method, message);
  }

  /**
   * Builds the headers that are used in the http requests. This includes json typed content type and possible
   * authorization data.
   * @private
   */
  private buildHeaders(contentType: string | null): HttpHeaders {
    // Note: Do not set header fields to undefined or null as the http module cannot handle that.
    let h = this.requestHeaders;
    if (contentType != null) {
      h = h.set('Content-Type', contentType);
    }
    return h;
  }

  /**
   * Builds the request options that are used with each request.
   *
   * @param params Http params to set.
   * @param contentType The content type of the request.
   * @private
   */
  private buildRequestOptions(params: object, contentType: string | null): { headers: HttpHeaders, params: HttpParams } {
    return {
      headers: this.buildHeaders(contentType),
      params: new HttpParams({ fromObject: clean(params) }),
    };
  }

  /**
   * Builds the url to use for performing http requests.
   * @param path The url path.
   * @throws MDSError When {@link baseUrl} is not set.
   * @private
   */
  private buildUrl(path: string): string {
    if (!this.baseUrl) {
      throw new MDSError(MDSErrorCode.AppError, 'missing base url');
    }
    return new URL(path, this.baseUrl).href;
  }

  delete(path: string, params: object): Observable<void> {
    return this.http.delete(this.buildUrl(path), {
      responseType: 'text',
      ...this.buildRequestOptions(params, null),
    }).pipe(
      catchError((err: HttpErrorResponse) => throwError(() => NetService.handleError(err, StoreRequestMethod.Delete))),
      map(() => void 0),
    );
  }

  get<T>(path: string, params: object): Observable<T> {
    return this.http.get<T>(this.buildUrl(path), {
      responseType: 'json',
      ...this.buildRequestOptions(params, null),
    }).pipe(
      catchError((err: HttpErrorResponse) => throwError(() => NetService.handleError(err, StoreRequestMethod.Get))),
    );
  }

  postJSON<T>(path: string, body: object, params: object): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), clean(body), {
      responseType: 'json',
      ...this.buildRequestOptions(params, 'application/json'),
    }).pipe(
      catchError((err: HttpErrorResponse) => throwError(() => NetService.handleError(err, StoreRequestMethod.Post))),
    );
  }

  post<T>(path: string, params: object): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), undefined, {
      responseType: 'json',
      ...this.buildRequestOptions(params, null),
    }).pipe(
      catchError((err: HttpErrorResponse) => throwError(() => NetService.handleError(err, StoreRequestMethod.Post))),
    );
  }

  putJSON(path: string, body: object, params: object): Observable<void> {
    return this.http.put(this.buildUrl(path), clean(body), {
      ...this.buildRequestOptions(params, 'application/json'),
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => NetService.handleError(err, StoreRequestMethod.Put));
      }),
      map(() => void 0),
    );
  }
}
