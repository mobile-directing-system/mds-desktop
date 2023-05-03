import { of, OperatorFunction, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Used as a container for errors in MDS. The wrapping concept is taken from error handling in Go.
 */
export class MDSError extends Error {
  /**
   * The error code.
   */
  code?: MDSErrorCode;
  /**
   * The optionally wrapped error. This concept is taken from error handling in Go.
   */
  wrapped?: MDSError;
  /**
   * Optional details.
   */
  details?: object;

  constructor(code?: MDSErrorCode, message?: string, details?: object) {
    super(message);
    this.code = code;
    this.details = details;
  }

  /**
   * Returns a new {@link MDSError} with this one set as {@link wrapped}.
   * @param message The new message.
   * @param details The new details.
   */
  wrap(message?: string, details?: object): MDSError {
    const error = new MDSError(undefined, message, details);
    error.wrapped = this;
    return error;
  }

  /**
   * Returns the highest-level error code. If none is set, then the {@link wrapped} one is considered. If none is found,
   * {@link MDSErrorCode.Unexpected} is returned.
   */
  finalCode(): MDSErrorCode {
    let error: MDSError = this;
    while (true) {
      if (error.code) {
        return error.code;
      }
      if (!error.wrapped) {
        return MDSErrorCode.Unexpected;
      }
      error = error.wrapped;
    }
  }
}

/**
 * Error types for {@link MDSError}.
 */
export enum MDSErrorCode {
  /**
   * Similar to bad request in http.
   */
  BadInput,
  /**
   * Not authenticated to access a resource. Normally, this redirects to the login page.
   */
  Unauthorized,
  /**
   * Insufficient rights to access a resource.
   */
  Forbidden,
  /**
   * A resource was not found.
   */
  NotFound,
  /**
   * The server responded with an internal error.
   */
  ServerError,
  /**
   * For errors in the desktop app.
   */
  AppError,
  /**
   * Unexpected error if no code was provided.
   */
  Unexpected
}

/**
 * Maps to the given value, if the {@link Error} is an {@link MDSError} with {@link MDSErrorCode.Forbidden}.
 * @param mapTo The value to use for a matching {@link Error}.
 */
export function mapMDSForbiddenErrorTo<T>(mapTo: T): OperatorFunction<any, T> {
  return catchError(error => {
    if (error instanceof MDSError && error.finalCode() == MDSErrorCode.Forbidden) {
      return of(mapTo);
    }
    return throwError(() => error);
  });
}
