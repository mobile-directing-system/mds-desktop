import { AuthService } from './auth.service';
import { createServiceFactory, createSpyObject, SpectatorService } from '@ngneat/spectator';
import { NetService } from './net.service';
import { fakeAsync, tick } from '@angular/core/testing';
import {of, Subject, throwError} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import anything = jasmine.anything;
import createSpy = jasmine.createSpy;
import {GroupService} from "./group.service";
import {Group} from "../model/group";
import {Paginated} from "../util/store";

describe('AuthService', () => {
  let spectator: SpectatorService<AuthService>;
  let groupsSubject: Subject<Paginated<Group>> = new Subject();

  const group: Group | undefined = {
    id: "loggedInRoleId",
    title: "S1",
    description: "description",
    members:["loggedInUserId"]
  };
  const paginatedGroups: Paginated<Group> = new Paginated<Group>([group],{
    total: 1,
    limit: 1,
    offset: 0,
    retrieved: 1,
  })

  const emptyPaginatedGroups: Paginated<Group> = new Paginated<Group>([],{
    total: 0,
    limit: 1,
    offset: 0,
    retrieved: 0,
  })

  const createService = createServiceFactory({
    service: AuthService,
    providers: [
      {
        provide: NetService,
        useFactory: () => {
          const netService = createSpyObject(NetService);
          // Initialize headers.
          netService.requestHeaders = new HttpHeaders();
          return netService;
        },
      },
      {
        provide: GroupService,
        useValue: {
          getGroups: ()=> groupsSubject,
        },
      }
    ],
  });
  const username = 'accept';
  const pass = 'history';
  const tokenOK = {
    user_id: 'cat',
    access_token: 'sure',
    token_type: 'liar',
  };

  describe('with local data', () => {
    it('should ignore auth token and if of logged in user if server url is not set', () => {
      const lsService = createSpyObject(LocalStorageService);
      lsService.getItem.withArgs(LocalStorageService.TokenServerURL).and.returnValue(null);
      lsService.getItem.withArgs(LocalStorageService.TokenAuthToken).and.returnValue('cheese');
      lsService.getItem.withArgs(LocalStorageService.TokenLoggedInUserId).and.returnValue('boast');

      spectator = createService({
        providers: [
          {
            provide: LocalStorageService,
            useValue: lsService,
          },
        ],
      });

      expect(spectator.service.loggedInUser()).withContext('should not set user id').toBeFalsy();
      expect(spectator.inject(NetService).requestHeaders.get('Authorization')).withContext('should not set auth header').toBeFalsy();
    });

    it('should ignore auth token when id of logged in user is not set', () => {
      const lsService = createSpyObject(LocalStorageService);
      lsService.getItem.withArgs(LocalStorageService.TokenServerURL).and.returnValue('country');
      lsService.getItem.withArgs(LocalStorageService.TokenAuthToken).and.returnValue('cheese');
      lsService.getItem.withArgs(LocalStorageService.TokenLoggedInUserId).and.returnValue(null);

      spectator = createService({
        providers: [
          {
            provide: LocalStorageService,
            useValue: lsService,
          },
        ],
      });

      expect(spectator.service.loggedInUser()).withContext('should not set user id').toBeFalsy();
      expect(spectator.inject(NetService).requestHeaders.get('Authorization')).withContext('should not set auth header').toBeFalsy();
    });

    it('should ignore id of logged in user when auth token is not set', () => {
      const lsService = createSpyObject(LocalStorageService);
      lsService.getItem.withArgs(LocalStorageService.TokenServerURL).and.returnValue('country');
      lsService.getItem.withArgs(LocalStorageService.TokenAuthToken).and.returnValue(null);
      lsService.getItem.withArgs(LocalStorageService.TokenLoggedInUserId).and.returnValue('fever');

      spectator = createService({
        providers: [
          {
            provide: LocalStorageService,
            useValue: lsService,
          },
        ],
      });

      expect(spectator.service.loggedInUser()).withContext('should not set user id').toBeFalsy();
      expect(spectator.inject(NetService).requestHeaders.get('Authorization')).withContext('should not set auth header').toBeFalsy();
    });

    it('should set auth token and id of logged in user correctly if set', () => {
      const lsService = createSpyObject(LocalStorageService);
      lsService.getItem.withArgs(LocalStorageService.TokenServerURL).and.returnValue('country');
      lsService.getItem.withArgs(LocalStorageService.TokenAuthToken).and.returnValue('line');
      lsService.getItem.withArgs(LocalStorageService.TokenLoggedInUserId).and.returnValue('fever');

      spectator = createService({
        providers: [
          {
            provide: LocalStorageService,
            useValue: lsService,
          },
        ],
      });

      expect(spectator.service.loggedInUser()).withContext('should set user id correctly')
        .toEqual('fever');
      expect(spectator.inject(NetService).requestHeaders.get('Authorization')).withContext('should set auth header correctly')
        .toEqual('Bearer line');
    });
  });

  describe('without local data', () => {
    beforeEach(() => {
      const lsService = createSpyObject(LocalStorageService);
      lsService.getItem.withArgs(LocalStorageService.TokenServerURL).and.returnValue('rubber');
      lsService.getItem.withArgs(LocalStorageService.TokenAuthToken).and.returnValue(null);
      lsService.getItem.withArgs(LocalStorageService.TokenLoggedInUserId).and.returnValue(null);
      spectator = createService({
        providers: [
          {
            provide: LocalStorageService,
            useValue: lsService,
          },
        ],
      });
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
          .toEqual(`Bearer ${ tokenOK.access_token }`);
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

    it('should pass loggedInRole when available', fakeAsync(() => {
      let observed: (Group | undefined);
      spectator.service.loggedInRole().subscribe(res=> observed = res);
      groupsSubject.next(paginatedGroups);
      tick();
      expect(observed).toEqual(group);
    }));

    it('should pass undefined when loggedInRole is not available', fakeAsync(() => {
      let observed: (Group | undefined);
      spectator.service.loggedInRole().subscribe(res=> observed = res);
      groupsSubject.next(emptyPaginatedGroups);
      tick();
      expect(observed).toBeUndefined();
    }));
  });
});
