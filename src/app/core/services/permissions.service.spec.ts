import {PermissionsService} from './permissions.service';
import {createServiceFactory, SpectatorService} from "@ngneat/spectator";
import {NetService} from "./net.service";
import {Permission, Permissions} from "../model/permissions";
import {fakeAsync, tick} from "@angular/core/testing";
import {of, throwError} from "rxjs";
import createSpy = jasmine.createSpy;

describe('PermissionsService', () => {
  let spectator: SpectatorService<PermissionsService>;
  const createService = createServiceFactory({
    service: PermissionsService,
    mocks: [NetService]
  });

  beforeEach(() => {
    spectator = createService();

  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });
  describe('setPermissionsFor', () => {
    const permissionsToBeSet: Permission[] = [
      {
        name: Permissions.PermissionsUpdate,
        option: undefined,
      },
      {
        name: Permissions.GroupCreate,
        option: undefined,
      },
      {
        name: Permissions.IntelCreate,
        option: undefined,
      },
    ];
    const userId = 'AViewToAKill';

    it('should set permissions for a user correctly', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(of(undefined));

      spectator.service.setPermissionsFor(userId, permissionsToBeSet).subscribe();
      tick();

      expect(putSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/permissions/user/' + userId, [{
          name: Permissions.PermissionsUpdate,
          option: undefined,
        },
        {
          name: Permissions.GroupCreate,
            option: undefined,
        },
        {
          name: Permissions.IntelCreate,
            option: undefined,
        }]
      ,{});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('get bonked')));
      const cbSpy = createSpy();

      spectator.service.setPermissionsFor(userId, permissionsToBeSet).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('retrievePermission', () => {
    const userId = 'TheLivingDaylight';
    const expectPermissions: Permission[] = [
      {
        name: Permissions.PermissionsUpdate,
        option: undefined,
      },
      {
        name: Permissions.GroupCreate,
        option: undefined,
      },
      {
        name: Permissions.IntelCreate,
        option: undefined,
      },
    ];
    it('should return the correct permissions for the respective user', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(expectPermissions));
      const cbSpy = createSpy();

      spectator.service.retrievePermissions(userId).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/permissions/user/'+userId, {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectPermissions);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.retrievePermissions(userId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));

  });
});
