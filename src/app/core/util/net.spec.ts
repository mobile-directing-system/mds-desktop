import { clean, createStoreRequestErrorFromHttp } from './net';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorResponse } from '@angular/common/http';
import { MDSErrorCode } from './errors';
import { StoreRequestMethod } from './store';

function createDefaultHttpErrFromStatus(status: number): HttpErrorResponse {
  return new HttpErrorResponse({ status });
}

describe('net-utils', () => {
  describe('createStoreRequestErrorFromHttp', () => {

    const details = {
      method: StoreRequestMethod.Get,
      id: 42,
      obj: {
        a: 1,
        b: 'Hello World!',
      },
    };

    it('should return the correct error type for not-found', () => {
      expect(createStoreRequestErrorFromHttp(createDefaultHttpErrFromStatus(StatusCodes.NOT_FOUND), StoreRequestMethod.Get).code)
        .toBe(MDSErrorCode.NotFound);
    });

    it('should return the correct error type for bad-request', () => {
      expect(createStoreRequestErrorFromHttp(createDefaultHttpErrFromStatus(StatusCodes.BAD_REQUEST), StoreRequestMethod.Get).code)
        .toBe(MDSErrorCode.BadInput);
    });

    it('should return the correct error type for internal server error', () => {
      expect(createStoreRequestErrorFromHttp(createDefaultHttpErrFromStatus(StatusCodes.INTERNAL_SERVER_ERROR), StoreRequestMethod.Get).code)
        .toBe(MDSErrorCode.ServerError);
    });

    it('should return an unexpected error type for any unknown error', () => {
      expect(createStoreRequestErrorFromHttp(createDefaultHttpErrFromStatus(StatusCodes.IM_A_TEAPOT), StoreRequestMethod.Get).code)
        .toBe(MDSErrorCode.Unexpected);
    });
  });

  describe('clean', () => {
    it('should remove null fields from a given object', () => {
      const myObject = {
        hello: 'world',
        iLoveCookies: null,
      };

      const cleansedObject = clean(myObject);

      expect(cleansedObject).toBeTruthy();
      expect(cleansedObject.hello).toBeTruthy();
      expect(cleansedObject.iLoveCookies).toBeFalsy();
      expect(cleansedObject.iLoveCookies).not.toBeNull();
    });
  });
});
