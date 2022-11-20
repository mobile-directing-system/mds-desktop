import {GroupService, GroupSort} from "./group.service";
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NetService } from './net.service';
import { Group, CreateGroup } from '../model/group';
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
import {User} from "../model/user";

describe('GroupService', () => {
  let spectator: SpectatorService<GroupService>;
  const createService = createServiceFactory({
    service: GroupService,
    mocks: [NetService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('createGroup', () => {
    const create: CreateGroup = {
      title: 'You only Live Twice',
      description:'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny'
      ],
    };
    const netCreated = {
      id: '1967',
      title: 'You only Live Twice',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny'
      ],
    };

    const expectCreated: Group = {
      id: '1967',
      title: 'You only Live Twice',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny'
      ],
    };

    it('should create a group correctly', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(netCreated));
      const cbSpy = createSpy();

      spectator.service.createGroup(create).subscribe({ next: cbSpy });
      tick();

      expect(postSpy).withContext('should perform correct next call').toHaveBeenCalledOnceWith('/groups', {
        title: create.title,
        description: create.description,
        operation: create.operation,
        members: create.members,
      }, {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectCreated);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('well well Mr. Bond')));
      const cbSpy = createSpy();

      spectator.service.createGroup(create).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('updateGroup', () => {
    const update: Group = {
      id: '1969',
      title: 'On her Majesties Secret Service',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny'
      ],
    };

    it('should update a group correctly', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(of(undefined));

      spectator.service.updateGroup(update).subscribe();
      tick();

      expect(putSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/groups/1969', {
        id: '1969',
        title: update.title,
        description: update.description,
        operation: update.operation,
        members: update.members,
      }, {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('well well Mr. Bond')));
      const cbSpy = createSpy();

      spectator.service.updateGroup(update).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getGroupById', () => {
    const groupId = '1971';
    const netUser = {
      id: groupId,
      title: 'Diamond are Forever',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny'
      ],
    };
    const expectUser: Group = {
      id: groupId,
      title: 'Diamond are Forever',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny'
      ],
    };

    it('should return the correct group upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netUser));
      const cbSpy = createSpy();

      spectator.service.getGroupById(groupId).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/groups/1971', {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectUser);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('well well Mr. Bond')));
      const cbSpy = createSpy();

      spectator.service.getGroupById(groupId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });
});
