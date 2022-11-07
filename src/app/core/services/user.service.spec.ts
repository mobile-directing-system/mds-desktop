import { UserService, UserSort } from './user.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NetService } from './net.service';
import { CreateUser, User } from '../model/user';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
  testGenNetPaginated,
  testGenNetPaginationParams,
  testGenPaginatedFromNet,
  testGenRandomPaginationParams,
} from '../testutil/test-pagination';
import { testGenNetSearchResult, testGenRandomSearchParams, testGenSearchResultFromNet } from '../testutil/test-search';
import { netSearchParams } from '../util/net';
import createSpy = jasmine.createSpy;

describe('UserService', () => {
  let spectator: SpectatorService<UserService>;
  const createService = createServiceFactory({
    service: UserService,
    mocks: [NetService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('createUser', () => {
    const create: CreateUser = {
      username: 'degree',
      firstName: 'qualify',
      lastName: 'wicked',
      isAdmin: false,
      initialPass: 'round',
    };
    const netCreated = {
      id: 'engineer',
      username: 'tribe',
      first_name: 'spoil',
      last_name: 'jealousy',
      is_admin: false,
      is_active: true,
    };
    const expectCreated: User = {
      id: 'engineer',
      username: 'tribe',
      firstName: 'spoil',
      lastName: 'jealousy',
      isAdmin: false,
      isActive: true,
    };

    it('should create a user correctly', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(netCreated));
      const cbSpy = createSpy();

      spectator.service.createUser(create).subscribe({ next: cbSpy });
      tick();

      expect(postSpy).withContext('should perform correct next call').toHaveBeenCalledOnceWith('/users', {
        username: create.username,
        first_name: create.firstName,
        last_name: create.lastName,
        is_admin: create.isAdmin,
        pass: create.initialPass,
      }, {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectCreated);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.createUser(create).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('updateUser', () => {
    const update: User = {
      id: 'wonderful',
      username: 'degree',
      firstName: 'qualify',
      lastName: 'wicked',
      isAdmin: false,
      isActive: true,
    };

    it('should update a user correctly', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(of(undefined));

      spectator.service.updateUser(update).subscribe();
      tick();

      expect(putSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/users/wonderful', {
        id: 'wonderful',
        username: update.username,
        first_name: update.firstName,
        last_name: update.lastName,
        is_admin: update.isAdmin,
        is_active: update.isActive,
      }, {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.updateUser(update).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('updateUserPass', () => {
    const userId = 'entrance';
    const newPass = 'skill';

    it('should update a user\'s password correctly', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(of(undefined));

      spectator.service.updateUserPass(userId, newPass).subscribe();
      tick();

      expect(putSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/users/entrance/pass', {
        user_id: userId,
        new_pass: newPass,
      }, {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.updateUserPass(userId, newPass).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getUserById', () => {
    const userId = 'rock';
    const netUser = {
      id: userId,
      username: 'spade',
      first_name: 'language',
      last_name: 'concern',
      is_admin: false,
      is_active: true,
    };
    const expectUser: User = {
      id: userId,
      username: 'spade',
      firstName: 'language',
      lastName: 'concern',
      isAdmin: false,
      isActive: true,
    };

    it('should return the correct user upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netUser));
      const cbSpy = createSpy();

      spectator.service.getUserById(userId).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/users/rock', {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectUser);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.getUserById(userId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getUsers', () => {
    const netUsers = [
      {
        id: 'barber',
        username: 'spade',
        first_name: 'language',
        last_name: 'concern',
        is_admin: false,
        is_active: true,
      },
      {
        id: 'stock',
        username: 'animal',
        first_name: 'stain',
        last_name: 'rude',
        is_admin: true,
        is_active: false,
      },
    ];
    const params = testGenRandomPaginationParams<UserSort>();
    const netPaginated = testGenNetPaginated(params, undefined, netUsers);

    it('should return the correct user list upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));
      const cbSpy = createSpy();

      spectator.service.getUsers(params).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/users', testGenNetPaginationParams(params, undefined));
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<User>(netPaginated, undefined, [
        {
          id: 'barber',
          username: 'spade',
          firstName: 'language',
          lastName: 'concern',
          isAdmin: false,
          isActive: true,
        },
        {
          id: 'stock',
          username: 'animal',
          firstName: 'stain',
          lastName: 'rude',
          isAdmin: true,
          isActive: false,
        },
      ]));
    }));

    new Map<UserSort, string>([
      [UserSort.ByUsername, 'username'],
      [UserSort.ByFirstName, 'first_name'],
      [UserSort.ByLastName, 'last_name'],
      [UserSort.ByIsAdmin, 'is_admin'],
    ]).forEach((netSort, appSort) => {
      it(`should map order-by ${ UserSort[appSort] } to ${ netSort }`, fakeAsync(() => {
        const params = testGenRandomPaginationParams<UserSort>(appSort);
        const netPaginated = testGenNetPaginated(params, netSort, []);
        const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));

        spectator.service.getUsers(params).subscribe();
        tick();

        expect(getSpy).withContext(`should map ${ appSort } to ${ netSort }`).toHaveBeenCalledOnceWith('/users', testGenNetPaginationParams(params, netSort));
      }));
    });

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.getUsers(params).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('searchUsers', () => {
    const netUsers = [
      {
        id: 'barber',
        username: 'spade',
        first_name: 'language',
        last_name: 'concern',
        is_admin: false,
        is_active: true,
      },
      {
        id: 'stock',
        username: 'animal',
        first_name: 'stain',
        last_name: 'rude',
        is_admin: true,
        is_active: false,
      },
    ];
    const params = testGenRandomSearchParams();
    const netSearchResult = testGenNetSearchResult(params, netUsers);

    it('should search users correctly', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netSearchResult));
      const cbSpy = createSpy();

      spectator.service.searchUsers(params, true).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/users/search', {
        ...netSearchParams(params),
        include_inactive: true,
      });
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenSearchResultFromNet<User>(netSearchResult, [
        {
          id: 'barber',
          username: 'spade',
          firstName: 'language',
          lastName: 'concern',
          isAdmin: false,
          isActive: true,
        },
        {
          id: 'stock',
          username: 'animal',
          firstName: 'stain',
          lastName: 'rude',
          isAdmin: true,
          isActive: false,
        },
      ]));
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.searchUsers(params, false).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });
});
