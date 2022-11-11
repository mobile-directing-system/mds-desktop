import { AuthService } from './auth.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NetService } from './net.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import anything = jasmine.anything;
import createSpy = jasmine.createSpy;

describe('AuthService', () => {
  let spectator: SpectatorService<AuthService>;
  const createService = createServiceFactory({
    service: AuthService,
    mocks: [NetService],
  });
  const username = 'accept';
  const pass = 'history';
  const tokenOK = {
    user_id: 'cat',
    access_token: 'sure',
    token_type: 'liar',
  };

  beforeEach(() => {
    spectator = createService();
    // Initialize headers.
    spectator.inject(NetService).requestHeaders = new (HttpHeaders);
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('login', () => {
    it('should perform correct net call', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(tokenOK));

      spectator.service.login(username, pass).subscribe({ error: error => fail(error) });
      tick();

      expect(postSpy).toHaveBeenCalledOnceWith('/login', {
        username: username,
        pass: pass,
      }, anything());
    }));

    it('should set the id of the logged in user', fakeAsync(() => {
      spectator.inject(NetService).postJSON.and.returnValue(of(tokenOK));

      spectator.service.login(username, pass).subscribe({ error: error => fail(error) });
      tick();

      expect(spectator.service.loggedInUser()).toEqual(tokenOK.user_id);
    }));

    it('should set the auth header in net-service', fakeAsync(() => {
      spectator.inject(NetService).postJSON.and.returnValue(of(tokenOK));

      spectator.service.login(username, pass).subscribe({ error: error => fail(error) });
      tick();

      expect(spectator.inject(NetService).requestHeaders.get('Authorization'))
        .toEqual(`${ tokenOK.token_type } ${ tokenOK.access_token }`);
    }));

    it('should resolve upon success', fakeAsync(() => {
      spectator.inject(NetService).postJSON.and.returnValue(of(tokenOK));
      const cbSpy = createSpy();

      spectator.service.login(username, pass).subscribe({
        next: cbSpy,
        error: error => fail(error),
      });
      tick();

      expect(cbSpy).toHaveBeenCalledOnceWith(true);
    }));

    it('should reject upon net fail', fakeAsync(() => {
      spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.login(username, pass).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(cbSpy).toHaveBeenCalledTimes(1);
      expect(spectator.service.loggedInUser()).withContext('should not set user id').toBeUndefined();
    }));
  });

  describe('logout', () => {
    beforeEach(async () => {
      // Login user.
      spectator.inject(NetService).postJSON.withArgs('/login', anything(), anything()).and.returnValue(of(tokenOK));
      await spectator.service.login(username, pass).subscribe();
    });

    it('should perform correct net call', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).post.and.returnValue(of(undefined));

      spectator.service.logout().subscribe({ error: error => fail(error) });
      tick();

      expect(postSpy).toHaveBeenCalledOnceWith('/logout', {});
    }));

    it('should clear id of the logged in user', fakeAsync(() => {
      spectator.inject(NetService).post.and.returnValue(of(undefined));

      spectator.service.logout().subscribe({ error: error => fail(error) });
      tick();

      expect(spectator.service.loggedInUser()).toBeFalsy();
    }));

    it('should clear the auth header in net-service', fakeAsync(() => {
      spectator.inject(NetService).post.and.returnValue(of(undefined));

      spectator.service.logout().subscribe({ error: error => fail(error) });
      tick();

      expect(spectator.inject(NetService).requestHeaders.get('Authorization')).toBeFalsy();
    }));

    it('should clear id of the logged in user upon failure', fakeAsync(() => {
      spectator.inject(NetService).post.and.returnValue(throwError(() => new Error('sad life')));

      spectator.service.logout().subscribe({
        next: () => fail('should fail'),
        error: () => {
        },
      });
      tick();

      expect(spectator.service.loggedInUser()).toBeFalsy();
    }));

    it('should clear the auth header in net-service upon failure', fakeAsync(() => {
      spectator.inject(NetService).post.and.returnValue(throwError(() => new Error('sad life')));

      spectator.service.logout().subscribe({
        next: () => fail('should fail'),
        error: () => {
        },
      });
      tick();

      expect(spectator.inject(NetService).requestHeaders.get('Authorization')).toBeFalsy();
    }));
  });

  it('should throw an error when trying to login while already logged in', fakeAsync(() => {
    // Login user.
    spectator.inject(NetService).postJSON.withArgs('/login', anything(), anything()).and.returnValue(of(tokenOK));
    spectator.service.login(username, pass).subscribe();
    tick();

    // Try to log in again.
    expect(() => spectator.service.login(username, pass).subscribe({
      next: () => fail('should fail'),
    })).toThrowError();
  }));

  it('should throw an error when trying to logout while not logged in', fakeAsync(() => {
    expect(() => spectator.service.logout().subscribe({
      next: () => fail('should fail'),
    })).toThrowError();
  }));
});
