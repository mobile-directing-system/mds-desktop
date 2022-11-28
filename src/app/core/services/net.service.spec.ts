import { NetService } from './net.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StatusCodes } from 'http-status-codes';
import { fakeAsync, tick } from '@angular/core/testing';
import anything = jasmine.anything;
import createSpy = jasmine.createSpy;

interface TestItem {
  a: number;
  b: string;
}


const url = 'http://localhost:123/hello-world';
const path = '/hello-world';
const notFoundHttpErrorResponse = new HttpErrorResponse({ status: StatusCodes.NOT_FOUND });

describe('NetService', () => {
  let spectator: SpectatorService<NetService>;
  const createService = createServiceFactory({
    service: NetService,
    imports: [HttpClientTestingModule],
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    spectator.service.setBaseUrl(url);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should call http delete for delete', fakeAsync(() => {
    const deleteSpy = spyOn(spectator.inject(HttpClient), 'delete').and.returnValue(of({}));
    const cbSpy = createSpy();

    spectator.service.delete(path, {}).subscribe({
      next: cbSpy,
      error: error => fail(error),
    });
    tick();

    expect(deleteSpy).withContext('should have called delete').toHaveBeenCalledOnceWith(url, anything());
    expect(cbSpy).withContext('should have called next').toHaveBeenCalledTimes(1);
  }));

  it('should call http get for get', fakeAsync(() => {
    const testItem: TestItem = {
      a: 42,
      b: 'Hello World!',
    };
    const getSpy = spyOn(spectator.inject(HttpClient), 'get').and.returnValue(of(testItem));
    const cbSpy = createSpy();

    spectator.service.get<TestItem>(url, {}).subscribe({
      next: cbSpy,
      error: error => fail(error),
    });
    tick();

    expect(getSpy).withContext('should have called get').toHaveBeenCalledOnceWith(url, anything());
    expect(cbSpy).withContext('should have called next').toHaveBeenCalledOnceWith(testItem);
  }));

  it('should call http post for post', fakeAsync(() => {
    const res: TestItem = {
      a: 120,
      b: 'firm',
    };
    const postSpy = spyOn(spectator.inject(HttpClient), 'post').and.returnValue(of(res));
    const cbSpy = createSpy();

    spectator.service.post<TestItem>(url, {}).subscribe({
      next: cbSpy,
      error: error => fail(error),
    });
    tick();

    expect(postSpy).withContext('should have called post').toHaveBeenCalledOnceWith(url, undefined, anything());
    expect(cbSpy).withContext('should have called next').toHaveBeenCalledOnceWith(res);
  }));

  it('should call http post for postJSON', fakeAsync(() => {
    const testItem: TestItem = {
      a: 42,
      b: 'Hello World!',
    };
    const postSpy = spyOn(spectator.inject(HttpClient), 'post').and.returnValue(of(testItem));
    const cbSpy = createSpy();

    spectator.service.postJSON<TestItem>(url, testItem, anything()).subscribe({
      next: cbSpy,
      error: error => fail(error),
    });
    tick();

    expect(postSpy).withContext('should have called post').toHaveBeenCalledOnceWith(url, testItem, anything());
    expect(cbSpy).withContext('should have called next').toHaveBeenCalledOnceWith(testItem);
  }));

  it('should call http put for put', fakeAsync(() => {
    const item: TestItem = {
      a: 897,
      b: 'courage',
    };
    const putSpy = spyOn(spectator.inject(HttpClient), 'put').and.returnValue(of(undefined));
    const cbSpy = createSpy();

    spectator.service.putJSON(url, item, anything()).subscribe({
      next: cbSpy,
      error: error => fail(error),
    });
    tick();

    expect(putSpy).withContext('should have called put').toHaveBeenCalledOnceWith(url, item, anything());
    expect(cbSpy).withContext('should have called next').toHaveBeenCalledOnceWith(undefined);
  }));

  it('should handle http error for delete call', fakeAsync(() => {
    spyOn(spectator.inject(HttpClient), 'delete').and.returnValue(throwError(() => notFoundHttpErrorResponse));
    const errorSpy = createSpy();

    spectator.service.delete(url, anything()).subscribe({
      next: () => fail('should fail'),
      error: errorSpy,
    });
    tick();

    expect(errorSpy).toHaveBeenCalledTimes(1);
  }));

  it('should handle http error for get call', fakeAsync(() => {
    spyOn(spectator.inject(HttpClient), 'get').and.returnValue(throwError(() => notFoundHttpErrorResponse));
    const errorSpy = createSpy();

    spectator.service.get<TestItem>(url, anything()).subscribe({
      next: () => fail('should fail'),
      error: errorSpy,
    });
    tick();

    expect(errorSpy).toHaveBeenCalledTimes(1);
  }));

  it('should handle http error for post call', fakeAsync(() => {
    spyOn(spectator.inject(HttpClient),
      'post').and.returnValue(throwError(() => notFoundHttpErrorResponse));
    const errorSpy = createSpy();

    spectator.service.postJSON<TestItem>(url, { x: 253 }, anything()).subscribe({
      next: () => fail('should fail'),
      error: errorSpy,
    });
    tick();

    expect(errorSpy).toHaveBeenCalledTimes(1);
  }));

  it('should handle http error for put call', fakeAsync(() => {
    spyOn(spectator.inject(HttpClient), 'put').and.returnValue(throwError(() => notFoundHttpErrorResponse));
    const errorSpy = createSpy();

    spectator.service.putJSON(url, { x: 1 }, anything()).subscribe({
      next: () => fail('should fail'),
      error: errorSpy,
    });
    tick();

    expect(errorSpy).toHaveBeenCalledTimes(1);
  }));
});
