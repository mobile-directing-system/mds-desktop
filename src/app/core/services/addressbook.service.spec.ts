import { AddressBookEntrySort, AddressBookService } from './addressbook.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NetService } from './net.service';
import { AddressBookEntry, CreateAddressBookEntry } from '../model/address-book-entry';
import { User } from '../model/user';
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

describe('AddressBookService', () => {
  let spectator: SpectatorService<AddressBookService>;
  const createService = createServiceFactory({
    service: AddressBookService,
    mocks: [NetService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });
  const sampleUser: User = {
    id: 'bite',
    username: 'card',
    firstName: 'ripe',
    lastName: 'far',
    isActive: true,
    isAdmin: false,
  };

  describe('createAddressBookEntry', () => {
    const create: CreateAddressBookEntry = {
      label: 'disturb',
      description: 'worry',
      operation: 'rather',
      user: 'bite',
    };

    const netCreated = {
      id: 'musician',
      label: 'disturb',
      description: 'worry',
      operation: 'rather',
      user: 'bite',
      user_details: {
        id: sampleUser.id,
        username: sampleUser.username,
        first_name: sampleUser.firstName,
        last_name: sampleUser.lastName,
        is_admin: sampleUser.isAdmin,
        is_active: sampleUser.isActive,
      },
    };
    const expectCreate: AddressBookEntry = {
      id: 'musician',
      label: 'disturb',
      description: 'worry',
      operation: 'rather',
      user: 'bite',
      userDetails: sampleUser,
    };
    it('should create address book entry correctly', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(netCreated));
      const cbSpy = createSpy();

      spectator.service.createAddressBookEntry(create).subscribe({ next: cbSpy });
      tick();

      expect(postSpy).withContext('should perform correct call').toHaveBeenCalledOnceWith('/address-book/entries', {
        label: 'disturb',
        description: 'worry',
        operation: 'rather',
        user: 'bite',
      }, {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectCreate);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.createAddressBookEntry(create).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });


  describe('deleteAddressBookEntry', () => {
    const addressBookEntryId = 'cruel';

    it('should delete address book entry correctly', fakeAsync(() => {
      const deleteSpy = spectator.inject(NetService).delete.and.returnValue(of(undefined));
      spectator.service.deleteAddressBookEntry(addressBookEntryId);
      tick();

      expect(deleteSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/address-book/entries/cruel', {});
    }));
  });

  describe('updateAddressBookEntry', () => {
    const update: AddressBookEntry = {
      id: 'musician',
      label: 'disturb',
      description: 'worry',
      operation: 'rather',
      user: 'bite',
      userDetails: sampleUser,
    };

    it('should update an address book entry correctly', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(of(undefined));
      spectator.service.updateAddressBookEntry(update).subscribe();
      tick();

      expect(putSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/address-book/entries/musician', {
        id: 'musician',
        label: 'disturb',
        description: 'worry',
        operation: 'rather',
        user: 'bite',
      }, {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.updateAddressBookEntry(update).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getAddressBookEntryById', () => {
    const entryId = 'musician';
    const netEntry = {
      id: 'musician',
      label: 'disturb',
      description: 'worry',
      operation: 'rather',
      user: 'bite',
      user_details: {
        id: sampleUser.id,
        username: sampleUser.username,
        first_name: sampleUser.firstName,
        last_name: sampleUser.lastName,
        is_admin: sampleUser.isAdmin,
        is_active: sampleUser.isActive,
      },
    };

    const expectEntry: AddressBookEntry = {
      id: 'musician',
      label: 'disturb',
      description: 'worry',
      operation: 'rather',
      user: 'bite',
      userDetails: sampleUser,
    };

    it('should return the correct address book entry upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netEntry));
      const cbSpy = createSpy();

      spectator.service.getAddressBookEntryById(entryId).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/address-book/entries/musician', {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectEntry);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.getAddressBookEntryById(entryId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getEntries', () => {
    const netEntries = [
      {
        id: 'musician',
        label: 'disturb',
        description: 'worry',
        operation: 'rather',
        user: 'bite',
        user_details: {
          id: sampleUser.id,
          username: sampleUser.username,
          first_name: sampleUser.firstName,
          last_name: sampleUser.lastName,
          is_admin: sampleUser.isAdmin,
          is_active: sampleUser.isActive,
        },
      },
      {
        id: 'hurrah',
        label: 'life',
        description: 'reason',
        operation: undefined,
        user: undefined,
        user_details: undefined,
      },
    ];

    const params = testGenRandomPaginationParams<AddressBookEntrySort>();
    const netPaginated = testGenNetPaginated(params, undefined, netEntries);

    it('should return the correct list of address book entries upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));
      const cbSpy = createSpy();

      spectator.service.getAddressBookEntries(params, {}).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/address-book/entries', {
        ...testGenNetPaginationParams(params, undefined),
        by_user: undefined,
        for_operation: undefined,
        exclude_global: undefined,
        visible_by: undefined,
        include_for_inactive_users: undefined,
        auto_delivery_enabled: undefined,
      });
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<AddressBookEntry>(netPaginated, undefined, [
        {
          id: 'musician',
          label: 'disturb',
          description: 'worry',
          operation: 'rather',
          user: 'bite',
          userDetails: sampleUser,
        },
        {
          id: 'hurrah',
          label: 'life',
          description: 'reason',
          operation: undefined,
          user: undefined,
          userDetails: undefined,
        },
      ]));
    }));

    new Map<AddressBookEntrySort, string>([
      [AddressBookEntrySort.ByLabel, 'label'],
      [AddressBookEntrySort.ByDescription, 'description'],
    ]).forEach((netSort, appSort) => {
      it(`should map order-by ${ AddressBookEntrySort[appSort] } to ${ netSort }`, fakeAsync(() => {
        const params = testGenRandomPaginationParams<AddressBookEntrySort>(appSort);
        const netPaginated = testGenNetPaginated(params, netSort, []);
        const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));

        spectator.service.getAddressBookEntries(params, {}).subscribe();
        tick();

        expect(getSpy).withContext(`should map ${ appSort } to ${ netSort }`).toHaveBeenCalledOnceWith('/address-book/entries', {
          ...testGenNetPaginationParams(params, netSort),
          by_user: undefined,
          for_operation: undefined,
          exclude_global: undefined,
          visible_by: undefined,
          include_for_inactive_users: undefined,
          auto_delivery_enabled: undefined,
        });
      }));

      it('should call error on net call fail', fakeAsync(() => {
        const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
        const cbSpy = createSpy();

        spectator.service.getAddressBookEntries(params, {}).subscribe({
          next: () => fail('should fail'),
          error: cbSpy,
        });
        tick();

        expect(putSpy).toHaveBeenCalledTimes(1);
        expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
      }));
    });
  });

  describe('searchAddressBookEntries', () => {
    const netEntries = [
      {
        id: 'musician',
        label: 'disturb',
        description: 'worry',
        operation: 'rather',
        user: 'bite',
        user_details: {
          id: sampleUser.id,
          username: sampleUser.username,
          first_name: sampleUser.firstName,
          last_name: sampleUser.lastName,
          is_admin: sampleUser.isAdmin,
          is_active: sampleUser.isActive,
        },
      },
      {
        id: 'hurrah',
        label: 'life',
        description: 'reason',
        operation: undefined,
        user: undefined,
        user_details: undefined,
      },
    ];

    const params = testGenRandomSearchParams();
    const netSearchResult = testGenNetSearchResult(params, netEntries);

    it('should search address book entries correctly', fakeAsync(() => {
      const searchSpy = spectator.inject(NetService).get.and.returnValue(of(netSearchResult));
      const cbSpy = createSpy();

      spectator.service.searchAddressBookEntries(params, {}).subscribe({ next: cbSpy });
      tick();

      expect(searchSpy).toHaveBeenCalledOnceWith('/address-book/entries/search', {
        ...netSearchParams(params),
        by_user: undefined,
        for_operation: undefined,
        exclude_global: undefined,
        visible_by: undefined,
        include_for_inactive_users: undefined,
      });

      expect(cbSpy).toHaveBeenCalledOnceWith(testGenSearchResultFromNet<AddressBookEntry>(netSearchResult, [
        {
          id: 'musician',
          label: 'disturb',
          description: 'worry',
          operation: 'rather',
          user: 'bite',
          userDetails: sampleUser,
        },
        {
          id: 'hurrah',
          label: 'life',
          description: 'reason',
          operation: undefined,
          user: undefined,
          userDetails: undefined,
        },
      ]));
    }));
  });
});
